import React, { useState, useEffect } from "react";
import AxiosApiSkills from "./AxiosApiSkills"; // Axios API 호출 파일
import "./SkillList.css"; // 스타일 적용

const SkillList = ({ profileId }) => {
  const [skills, setSkills] = useState([]); // 기술 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [newSkill, setNewSkill] = useState(""); // 새로운 기술 입력 상태
  const [editingSkill, setEditingSkill] = useState(null); // 수정 중인 기술 상태
  const [editedSkillName, setEditedSkillName] = useState(""); // 수정할 기술 이름 상태

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

  // 새로운 기술 추가
  const addSkill = async () => {
    if (!newSkill) return; // 기술 이름이 없으면 추가하지 않음
    try {
      const skill = { skillName: newSkill };
      const addedSkill = await AxiosApiSkills.createSkill(profileId, skill);
      setSkills([...skills, addedSkill]); // 추가된 기술을 목록에 추가
      setNewSkill(""); // 입력값 초기화
    } catch (error) {
      console.error("기술 추가 중 오류 발생:", error);
    }
  };

  // 기술 수정
  const updateSkill = async (skillId) => {
    if (!editedSkillName) return; // 수정할 이름이 없으면 수정하지 않음
    try {
      const skill = { skillName: editedSkillName };
      const updatedSkill = await AxiosApiSkills.updateSkill(
        profileId,
        skillId,
        skill
      );
      setSkills(
        skills.map((skill) => (skill.id === skillId ? updatedSkill : skill))
      ); // 수정된 기술을 목록에 반영
      setEditingSkill(null); // 수정 상태 초기화
      setEditedSkillName(""); // 수정 이름 초기화
    } catch (error) {
      console.error("기술 수정 중 오류 발생:", error);
    }
  };

  // 기술 삭제
  const deleteSkill = async (skillId) => {
    try {
      await AxiosApiSkills.deleteSkill(profileId, skillId); // 기술 삭제
      setSkills(skills.filter((skill) => skill.id !== skillId)); // 삭제된 기술을 목록에서 제거
    } catch (error) {
      console.error("기술 삭제 중 오류 발생:", error);
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
      <div className="skill-list-header">
        <div className="add-skill">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="새로운 기술을 입력하세요"
          />
          <button onClick={addSkill}>기술 추가</button>
        </div>
      </div>

      <div className="skill-cards">
        {skills.map((skill) => (
          <div className="skill-card" key={skill.id}>
            {editingSkill === skill.id ? (
              <div className="edit-skill">
                <input
                  type="text"
                  value={editedSkillName}
                  onChange={(e) => setEditedSkillName(e.target.value)}
                />
                <button onClick={() => updateSkill(skill.id)}>수정</button>
                <button onClick={() => setEditingSkill(null)}>취소</button>
              </div>
            ) : (
              <>
                <div className="skill-name">{skill.skillName}</div>
                <div className="skill-actions">
                  <button
                    onClick={() => {
                      setEditingSkill(skill.id);
                      setEditedSkillName(skill.skillName);
                    }}
                  >
                    수정
                  </button>
                  <button onClick={() => deleteSkill(skill.id)}>삭제</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;
