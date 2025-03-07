import React, { useState, useEffect } from "react";
import AxiosApiSkills from "./AxiosApiSkills"; // Axios API 호출 파일
import "./SkillList.css"; // 스타일 적용

const SkillList = ({ profileId }) => {
  const [skills, setSkills] = useState([]); // 기술 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 기술 목록 가져오는 함수
  const fetchSkills = async () => {
    try {
      const data = await AxiosApiSkills.getSkillByProfileId(profileId); // 프로필 ID로 기술 목록 가져오기
      setSkills(data); // 상태 업데이트
    } catch (error) {
      console.error("기술 목록을 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  useEffect(() => {
    fetchSkills(); // 컴포넌트 마운트 시 기술 목록 가져오기
  }, [profileId]);

  if (loading) {
    return <div className="loading">기술 목록 로딩 중...</div>; // 로딩 중 표시
  }

  if (skills.length === 0) {
    return <div className="no-skills">등록된 기술이 없습니다.</div>; // 기술이 없을 경우
  }

  return (
    <div className="skill-list-container">
      <div className="skill-cards">
        {skills.map((skill, index) => (
          <div className="skill-card" key={index}>
            <div className="skill-name">{skill.skillName}</div>{" "}
            {/* skillName으로 수정 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;
