#!/usr/bin/env python3
"""
Step 2: Pathogen Diagnosis & Lab Test Ordering Engine (Chẩn đoán nguyên nhân & Chỉ định cận lâm sàng)
PECOMED CAP CDSS (Community-Acquired Pneumonia Clinical Decision Support System)
"""

from enum import Enum
from typing import List, Dict, Set, Any
from dataclasses import dataclass, field

class CareSetting(str, Enum):
    OUTPATIENT = "Ngoại trú (Nhẹ)"
    INPATIENT = "Nội trú (Trung bình / Nặng)"
    ICU = "ICU (Rất nặng / Nguy kịch)"

class PathogenCategory(str, Enum):
    BACTERIA = "Vi khuẩn"
    VIRUS = "Virus"
    FUNGI = "Nấm"

@dataclass
class Pathogen:
    id: str
    name: str
    category: PathogenCategory
    vietnamese_name: str = ""
    is_preset: bool = True
    score: int = 0
    matched_factors: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "vietnamese_name": self.vietnamese_name,
            "category": self.category.value,
            "score": self.score,
            "matched_factors": self.matched_factors
        }

# Base preset pathogens
PRESET_PATHOGENS: List[Pathogen] = [
    Pathogen("S_PNEUMONIAE", "Streptococcus pneumoniae", PathogenCategory.BACTERIA, "Phế cầu khuẩn"),
    Pathogen("M_PNEUMONIAE", "Mycoplasma pneumoniae", PathogenCategory.BACTERIA, "Vi khuẩn không điển hình"),
    Pathogen("C_PNEUMONIAE", "Chlamydia pneumoniae", PathogenCategory.BACTERIA, "Vi khuẩn không điển hình"),
    Pathogen("H_INFLUENZAE", "Haemophilus influenzae", PathogenCategory.BACTERIA, "Vi khuẩn gram âm đường hô hấp"),
    Pathogen("GRAM_NEG_ENTERIC", "Gram-negative enteric bacteria", PathogenCategory.BACTERIA, "Vi khuẩn gram âm đường ruột (Klebsiella, E. coli...)"),
    Pathogen("LEGIONELLA_SPP", "Legionella spp.", PathogenCategory.BACTERIA, "Legionella"),

    # Viruses
    Pathogen("INFLUENZA", "Influenza virus (A/B)", PathogenCategory.VIRUS, "Virus cúm A/B"),
    Pathogen("PARAINFLUENZA", "Parainfluenza virus", PathogenCategory.VIRUS, "Virus á cúm"),
    Pathogen("RSV", "Respiratory Syncytial Virus (RSV)", PathogenCategory.VIRUS, "Virus hợp bào hô hấp"),
    Pathogen("ENTEROVIRUS", "Enterovirus", PathogenCategory.VIRUS, "Enterovirus"),
    Pathogen("RHINOVIRUS", "Rhinovirus", PathogenCategory.VIRUS, "Rhinovirus"),
    Pathogen("ADENOVIRUS", "Adenovirus", PathogenCategory.VIRUS, "Adenovirus"),
    Pathogen("CORONAVIRUS", "Coronavirus", PathogenCategory.VIRUS, "Coronavirus khác"),
    Pathogen("SARS_COV_2", "SARS-CoV-2", PathogenCategory.VIRUS, "COVID-19"),
    Pathogen("HMPV", "Human Metapneumovirus (HMPV)", PathogenCategory.VIRUS, "HMPV"),
    Pathogen("CMV", "Cytomegalovirus (CMV)", PathogenCategory.VIRUS, "CMV"),
    Pathogen("EBV", "Epstein-Barr virus (EBV)", PathogenCategory.VIRUS, "EBV"),
    Pathogen("BOCAVIRUS", "Human Bocavirus", PathogenCategory.VIRUS, "Bocavirus")
]

class Step2DiagnosisEngine:
    def __init__(self):
        pass

    def run_filter_1(self, care_setting: CareSetting) -> Dict[str, Pathogen]:
        """
        Bộ lọc 1: Dựa vào mức độ nặng / nơi điều trị từ Bước 1
        """
        candidates: Dict[str, Pathogen] = {
            p.id: Pathogen(p.id, p.name, p.category, p.vietnamese_name, p.is_preset)
            for p in PRESET_PATHOGENS
        }

        if care_setting == CareSetting.OUTPATIENT:
            # Loại trừ Legionella spp và Vi khuẩn Gram âm đường ruột ở ngoại trú nhẹ
            candidates.pop("LEGIONELLA_SPP", None)
            candidates.pop("GRAM_NEG_ENTERIC", None)
        elif care_setting == CareSetting.INPATIENT:
            # Bổ sung vi khuẩn kỵ khí, nhiễm trùng phối hợp, Bordetella pertussis
            candidates["ANAEROBIC"] = Pathogen("ANAEROBIC", "Anaerobic bacteria", PathogenCategory.BACTERIA, "Vi khuẩn kỵ khí", is_preset=False)
            candidates["B_PERTUSSIS"] = Pathogen("B_PERTUSSIS", "Bordetella pertussis", PathogenCategory.BACTERIA, "Vi khuẩn ho gà", is_preset=False)
            candidates["CO_INFECTION"] = Pathogen("CO_INFECTION", "Mixed/Co-infection", PathogenCategory.BACTERIA, "Nhiễm trùng phối hợp", is_preset=False)
        elif care_setting == CareSetting.ICU:
            # Bổ sung kỵ khí, pertussis, Pseudomonas, S. aureus
            candidates["ANAEROBIC"] = Pathogen("ANAEROBIC", "Anaerobic bacteria", PathogenCategory.BACTERIA, "Vi khuẩn kỵ khí", is_preset=False)
            candidates["B_PERTUSSIS"] = Pathogen("B_PERTUSSIS", "Bordetella pertussis", PathogenCategory.BACTERIA, "Vi khuẩn ho gà", is_preset=False)
            candidates["CO_INFECTION"] = Pathogen("CO_INFECTION", "Mixed/Co-infection", PathogenCategory.BACTERIA, "Nhiễm trùng phối hợp", is_preset=False)
            candidates["P_AERUGINOSA"] = Pathogen("P_AERUGINOSA", "Pseudomonas aeruginosa", PathogenCategory.BACTERIA, "Trực khuẩn mủ xanh", is_preset=False)
            candidates["S_AUREUS"] = Pathogen("S_AUREUS", "Staphylococcus aureus", PathogenCategory.BACTERIA, "Tụ cầu vàng (MSSA/MRSA)", is_preset=False)

        return candidates

    def run_filter_2(
        self,
        candidate_set_a: Dict[str, Pathogen],
        risk_factors: Set[str],
        comorbidities: Set[str],
        symptoms: Set[str],
        history: Set[str]
    ) -> List[Pathogen]:
        """
        Bộ lọc 2: Tối ưu hóa chẩn đoán theo Keyword, thói quen, bệnh kèm
        """
        candidates = candidate_set_a

        def add_factor(pathogen_id: str, factor_name: str, score_bump: int = 1, default_name: str = "", viet_name: str = "", cat: PathogenCategory = PathogenCategory.BACTERIA):
            if pathogen_id not in candidates:
                candidates[pathogen_id] = Pathogen(pathogen_id, default_name or pathogen_id, cat, viet_name, is_preset=False)
            p = candidates[pathogen_id]
            p.score += score_bump
            p.matched_factors.append(factor_name)

        # 1. Thói quen
        if "smoking" in risk_factors:
            add_factor("S_PNEUMONIAE", "Hút thuốc lá")
            add_factor("H_INFLUENZAE", "Hút thuốc lá")
            add_factor("LEGIONELLA_SPP", "Hút thuốc lá", default_name="Legionella spp.", viet_name="Legionella")

        if "alcoholism" in risk_factors:
            add_factor("S_PNEUMONIAE", "Nghiện rượu")
            add_factor("H_INFLUENZAE", "Nghiện rượu")
            add_factor("KLEBSIELLA", "Klebsiella pneumoniae", 2, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella")
            add_factor("A_BAUMANNII", "Acinetobacter baumannii", 1, "Acinetobacter baumannii", "Vi khuẩn Acinetobacter")
            add_factor("ANAEROBIC", "Viêm phổi hít do nghiện rượu", 2, "Anaerobic bacteria", "Vi khuẩn kỵ khí")

        # 2. Bệnh đồng mắc & Tình trạng lâm sàng
        if "hiv" in comorbidities or "cd4_lt_200" in comorbidities:
            add_factor("S_PNEUMONIAE", "Nhiễm HIV / Suy giảm miễn dịch")
            add_factor("H_INFLUENZAE", "Nhiễm HIV / Suy giảm miễn dịch")
            add_factor("P_JIROVECII", "Pneumocystis jirovecii (PJP/PCP)", 3, "Pneumocystis jirovecii", "Nấm P. jirovecii", PathogenCategory.FUNGI)

        if "neutropenia" in comorbidities: # Giảm bạch cầu trung tính
            add_factor("P_AERUGINOSA", "Giảm bạch cầu trung tính (Neutropenia)", 3, "Pseudomonas aeruginosa", "Trực khuẩn mủ xanh")
            add_factor("S_AUREUS", "Giảm bạch cầu trung tính (Neutropenia)", 2, "Staphylococcus aureus", "Tụ cầu vàng")

        if "organ_transplant" in history or "immunosuppressive_drugs" in history:
            add_factor("CMV", "Dùng thuốc ức chế miễn dịch / Ghép tạng", 2)
            add_factor("RSV", "Ghép tạng / Ghép tủy", 2)

        if "copd_structural_lung" in comorbidities:
            add_factor("P_AERUGINOSA", "Bệnh phổi cấu trúc (COPD FEV1<30%, Giãn phế quản)", 3, "Pseudomonas aeruginosa", "Trực khuẩn mủ xanh")
            add_factor("S_PNEUMONIAE", "Bệnh phổi mạn tính / COPD", 2)
            add_factor("H_INFLUENZAE", "Bệnh phổi mạn tính / COPD", 2)

        if "severe_lung_aspiration" in comorbidities:
            add_factor("ANAEROBIC", "Viêm phổi hít / Bệnh phổi nặng", 3, "Anaerobic bacteria", "Vi khuẩn kỵ khí")

        if "diabetes" in comorbidities:
            add_factor("B_PSEUDOMALLEI", "Đái tháo đường (Whitmore)", 3, "Burkholderia pseudomallei", "Vi khuẩn Whitmore")
            add_factor("S_AUREUS", "Đái tháo đường", 2, "Staphylococcus aureus", "Tụ cầu vàng")
            add_factor("KLEBSIELLA", "Đái tháo đường", 2, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella")

        if "chronic_kidney_disease" in comorbidities:
            add_factor("B_PSEUDOMALLEI", "Bệnh thận mạn / Suy thận", 2, "Burkholderia pseudomallei", "Vi khuẩn Whitmore")
            add_factor("S_AUREUS", "Bệnh thận mạn", 2, "Staphylococcus aureus", "Tụ cầu vàng")

        if "rainy_season" in risk_factors:
            add_factor("B_PSEUDOMALLEI", "Mùa mưa / Tiếp xúc đất nước bẩn", 2, "Burkholderia pseudomallei", "Vi khuẩn Whitmore")

        if "skin_infection" in history or "iv_drug_use" in history:
            add_factor("S_AUREUS", "Tiêm chích nhiều lần / Nhiễm trùng da", 3, "Staphylococcus aureus", "Tụ cầu vàng")

        if "prior_mrsa" in history:
            add_factor("MRSA", "Tiền sử nhiễm MRSA", 4, "Methicillin-resistant Staphylococcus aureus", "MRSA (Tụ cầu kháng Methicillin)")

        if "prior_antibiotics" in history or "intubation" in history:
            add_factor("KLEBSIELLA", "Đặt nội khí quản / Dùng kháng sinh trước đó", 2, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella")
            add_factor("P_AERUGINOSA", "Tiền sử dùng kháng sinh / Can thiệp xâm lấn", 2, "Pseudomonas aeruginosa", "Trực khuẩn mủ xanh")

        if "post_influenza" in history:
            add_factor("S_AUREUS", "Tụ cầu sau nhiễm cúm", 3, "Staphylococcus aureus", "Tụ cầu vàng sau cúm")
            add_factor("S_PNEUMONIAE", "Bội nhiễm sau cúm", 2)

        # 3. Triệu chứng cơ năng
        if "high_fever_rusty_sputum" in symptoms:
            add_factor("S_PNEUMONIAE", "Sốt cao >39°C + Đờm rỉ sắt", 2)

        if "dry_cough_extra_pulmonary" in symptoms:
            add_factor("M_PNEUMONIAE", "Ho khan + Dấu hiệu ngoài phổi (đau đầu, tiêu chảy, phát ban)", 2)
            add_factor("C_PNEUMONIAE", "Ho khan kéo dài", 1)

        # Trả về danh sách được sắp xếp theo điểm ưu tiên giảm dần
        ranked_list = list(candidates.values())
        ranked_list.sort(key=lambda x: (x.score, x.is_preset), reverse=True)
        return ranked_list

    def generate_lab_orders(self, care_setting: CareSetting, candidate_set_b: List[Pathogen], symptoms: Set[str]) -> Dict[str, Any]:
        """
        Chỉ định cận lâm sàng vi sinh vật học tương ứng
        """
        general_tests = []
        specific_tests = []

        # 1. Xét nghiệm chung theo nơi điều trị
        if care_setting != CareSetting.OUTPATIENT:
            general_tests.append("Nhuộm Gram đờm / dịch phế quản (Bắt buộc cho bệnh nhân nội trú/ICU)")
            general_tests.append("Nuôi cấy đờm / dịch đường hô hấp + Kháng sinh đồ (AST)")

        if care_setting == CareSetting.ICU:
            general_tests.append("Cấy máu 2 vị trí trước khi dùng kháng sinh")
            general_tests.append("PCR hô hấp đa mồi (Respiratory Pathogen Multiplex PCR Panel)")

        if "pleural_effusion" in symptoms:
            general_tests.append("Chọc dò dịch màng phổi: Nhuộm Gram, nuôi cấy dịch màng phổi, sinh hóa dịch")

        # 2. Xét nghiệm đặc hiệu theo tác nhân top đầu
        top_ids = {p.id for p in candidate_set_b if p.score > 0 or p.is_preset}

        if "LEGIONELLA_SPP" in top_ids or any(p.id == "LEGIONELLA_SPP" for p in candidate_set_b[:5]):
            specific_tests.append("Legionella: Test nhanh kháng nguyên Legionella pneumophila serogroup 1 trong nước tiểu")
            specific_tests.append("Legionella: PCR đờm / Dịch rửa phế quản (BAL)")

        if "M_PNEUMONIAE" in top_ids or "C_PNEUMONIAE" in top_ids:
            specific_tests.append("Mycoplasma/Chlamydia: Real-time PCR hô hấp")
            specific_tests.append("Mycoplasma: Tìm hiệu giá kháng thể IgM/IgG huyết thanh")

        if "INFLUENZA" in top_ids or "SARS_COV_2" in top_ids or "RSV" in top_ids:
            specific_tests.append("Virus: Test nhanh kháng nguyên Cúm A/B, SARS-CoV-2, RSV")

        if "B_PSEUDOMALLEI" in top_ids:
            specific_tests.append("Whitmore (B. pseudomallei): Cấy máu, đờm, nước tiểu trên môi trường Ashdown")

        if "P_JIROVECII" in top_ids:
            specific_tests.append("P. jirovecii (PJP): Nhuộm soi Giemsa/Grocott dịch BAL + Real-time PCR P. jirovecii")

        if "MRSA" in top_ids or "S_AUREUS" in top_ids:
            specific_tests.append("Tụ cầu vàng / MRSA: Nuôi cấy + Real-time PCR mecA/pvl gene")

        return {
            "general_lab_orders": general_tests,
            "specific_lab_orders": specific_tests
        }

    def evaluate_step2(
        self,
        care_setting: CareSetting,
        risk_factors: Set[str],
        comorbidities: Set[str],
        symptoms: Set[str],
        history: Set[str]
    ) -> Dict[str, Any]:
        """
        Quy trình đánh giá đầy đủ Bước 2
        """
        set_a = self.run_filter_1(care_setting)
        set_b = self.run_filter_2(set_a, risk_factors, comorbidities, symptoms, history)
        lab_orders = self.generate_lab_orders(care_setting, set_b, symptoms)

        return {
            "care_setting": care_setting.value,
            "candidate_set_a_count": len(set_a),
            "candidate_set_b": [p.to_dict() for p in set_b],
            "lab_orders": lab_orders
        }

# --- Demonstration execution ---
if __name__ == "__main__":
    print("=== DEMO BƯỚC 2: CHẨN ĐOÁN NGUYÊN NHÂN & CHỈ ĐỊNH CẬN LÂM SÀNG (PECOMED CAP CDSS) ===")

    engine = Step2DiagnosisEngine()

    # Case 1: Bệnh nhân nam 58 tuổi, tiền sử COPD, đái tháo đường, nhập ICU do suy hô hấp
    print("\n--- CASE 1: Bệnh nhân nhập ICU, có COPD & Đái tháo đường ---")
    result_icu = engine.evaluate_step2(
        care_setting=CareSetting.ICU,
        risk_factors={"smoking", "rainy_season"},
        comorbidities={"copd_structural_lung", "diabetes"},
        symptoms={"high_fever_rusty_sputum", "pleural_effusion"},
        history={"prior_antibiotics"}
    )

    print(f"Phân loại nơi điều trị: {result_icu['care_setting']}")
    print(f"Số lượng tác nhân trong Tệp A (Sau bộ lọc 1): {result_icu['candidate_set_a_count']}")
    print("\n[Tệp B - Danh sách tác nhân nghi ngờ xếp theo ưu tiên (Bộ lọc 2)]:")
    for idx, p in enumerate(result_icu['candidate_set_b'][:8], 1):
        factors = f" ({', '.join(p['matched_factors'])})" if p['matched_factors'] else ""
        print(f"  {idx}. {p['name']} [{p['vietnamese_name']}] - Điểm: {p['score']}{factors}")

    print("\n[Chỉ định cận lâm sàng vi sinh phù hợp]:")
    print("  * Xét nghiệm chung:")
    for g in result_icu['lab_orders']['general_lab_orders']:
        print(f"    - {g}")
    print("  * Xét nghiệm đặc hiệu:")
    for s in result_icu['lab_orders']['specific_lab_orders']:
        print(f"    - {s}")
