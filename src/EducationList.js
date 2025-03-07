import React, { useState, useEffect, useCallback } from "react";
import AxiosApiEducations from "./AxiosApiEducations"; // Axios API 호출 파일
import "./EducationList.css"; // 스타일 적용

const EducationList = ({ profileId }) => {
  const [educationList, setEducationList] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // 수정할 항목의 ID를 추적
  const [newEducation, setNewEducation] = useState({
    degree: "",
    schoolName: "",
    startDate: "",
    endDate: "",
  });

  // 학력 목록 가져오기
  const fetchEducationList = useCallback(async () => {
    try {
      const data = await AxiosApiEducations.getEducationByProfileId(profileId); // 학력 목록 가져오기
      setEducationList(data);
    } catch (error) {
      console.error("학력을 가져오는 중 오류 발생:", error);
    }
  }, [profileId]); // profileId 변경 시에만 호출되도록

  useEffect(() => {
    fetchEducationList(); // 학력 목록 가져오기
  }, [fetchEducationList]); // 의존성 배열에 `fetchEducationList` 추가

  // 학력 삭제
  const handleDelete = async (educationId) => {
    try {
      await AxiosApiEducations.deleteEducation(profileId, educationId); // 학력 삭제 API 호출
      fetchEducationList(); // 삭제 후 목록 다시 가져오기
    } catch (error) {
      console.error("학력을 삭제하는 중 오류 발생:", error);
    }
  };

  // 학력 수정
  const handleEdit = (education) => {
    setIsEditing(education.id); // 수정할 항목의 ID 설정
  };

  // 학력 수정 완료
  const handleUpdate = async (educationId) => {
    const updatedData = {
      degree: newEducation.degree,
      schoolName: newEducation.schoolName,
      startDate: newEducation.startDate,
      endDate: newEducation.endDate,
    };

    try {
      await AxiosApiEducations.updateEducation(
        profileId,
        educationId,
        updatedData
      ); // 학력 수정 API 호출
      setIsEditing(null); // 수정 모드 종료
      fetchEducationList(); // 수정 후 목록 다시 가져오기
      setNewEducation({
        degree: "",
        schoolName: "",
        startDate: "",
        endDate: "",
      }); // 입력값 초기화
    } catch (error) {
      console.error("학력을 수정하는 중 오류 발생:", error);
    }
  };

  // 학력 추가
  const handleAddEducation = async () => {
    if (
      !newEducation.degree ||
      !newEducation.schoolName ||
      !newEducation.startDate ||
      !newEducation.endDate
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      await AxiosApiEducations.createEducation(profileId, newEducation); // 학력 추가 API 호출
      fetchEducationList(); // 추가 후 목록 다시 가져오기
      setNewEducation({
        degree: "",
        schoolName: "",
        startDate: "",
        endDate: "",
      }); // 입력값 초기화
    } catch (error) {
      console.error("학력을 추가하는 중 오류 발생:", error);
    }
  };

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="education-list">
      {/* 새로운 학력 추가 */}
      <div className="add-education-form">
        <h4>새로운 학력 추가</h4>
        <input
          type="text"
          name="degree"
          value={newEducation.degree}
          onChange={handleInputChange}
          placeholder="학위"
        />
        <input
          type="text"
          name="schoolName"
          value={newEducation.schoolName}
          onChange={handleInputChange}
          placeholder="학교"
        />
        <input
          type="text"
          name="startDate"
          value={newEducation.startDate}
          onChange={handleInputChange}
          placeholder="시작 날짜"
        />
        <input
          type="text"
          name="endDate"
          value={newEducation.endDate}
          onChange={handleInputChange}
          placeholder="종료 날짜"
        />
        <button onClick={handleAddEducation}>학력 추가</button>
      </div>
      {educationList.map((education) => (
        <div className="education-item" key={education.id}>
          {isEditing === education.id ? (
            <div>
              <input
                type="text"
                name="degree"
                value={newEducation.degree}
                onChange={handleInputChange}
                placeholder="학위"
              />
              <input
                type="text"
                name="schoolName"
                value={newEducation.schoolName}
                onChange={handleInputChange}
                placeholder="학교"
              />
              <input
                type="text"
                name="startDate"
                value={newEducation.startDate}
                onChange={handleInputChange}
                placeholder="시작 날짜"
              />
              <input
                type="text"
                name="endDate"
                value={newEducation.endDate}
                onChange={handleInputChange}
                placeholder="종료 날짜"
              />
              <button onClick={() => handleUpdate(education.id)}>
                수정 완료
              </button>
            </div>
          ) : (
            <div>
              <h3>{education.degree}</h3>
              <p>{education.schoolName}</p>
              <p>
                {education.startDate} - {education.endDate}
              </p>
              <button onClick={() => handleEdit(education)}>수정</button>
              <button onClick={() => handleDelete(education.id)}>삭제</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EducationList;
