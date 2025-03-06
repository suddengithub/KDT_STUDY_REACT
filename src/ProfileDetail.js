import React, { useEffect, useState } from "react";
import AxiosApiProfiles from "./AxiosApiProfiles"; // Axios API 호출 파일
import { useParams, useNavigate } from "react-router-dom"; // URL 파라미터 받기
import "./ProfileDetail.css";

const ProfileDetail = () => {
  const { profileId } = useParams(); // URL 파라미터에서 profileId 가져오기
  const [profile, setProfile] = useState(null); // 프로필 상세 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [activeTab, setActiveTab] = useState("profile"); // 활성화된 탭 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 활성화 상태
  const [editedProfileContent, setEditedProfileContent] = useState(""); // 수정된 프로필 내용
  const [editedEducationContent, setEditedEducationContent] = useState(""); // 수정된 학력 내용
  const [isAddMode, setIsAddMode] = useState(false); // 학력 추가 모드
  const [newEducation, setNewEducation] = useState({
    degree: "",
    schoolName: "",
    startDate: "",
    endDate: "",
  }); // 새 학력 내용
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  // 프로필 상세 정보 가져오는 함수
  const fetchProfileDetail = async () => {
    try {
      const data = await AxiosApiProfiles.getProfileById(profileId); // 프로필 ID로 데이터 가져오기
      setProfile(data); // 상태 업데이트
      setEditedProfileContent(data.profileContent); // 수정된 내용은 프로필 내용으로 초기화
    } catch (error) {
      console.error("프로필을 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  useEffect(() => {
    fetchProfileDetail(); // 페이지 로드 시 프로필 상세 정보 가져오기
  }, [profileId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab); // 탭 전환
  };

  const handleEdit = () => {
    setIsEditing(true); // 수정 모드 활성화
  };

  const handleSave = async () => {
    try {
      await AxiosApiProfiles.updateProfile(profileId, {
        profileContent: editedProfileContent,
      }); // 수정된 프로필 내용 저장
      setProfile((prevProfile) => ({
        ...prevProfile,
        profileContent: editedProfileContent,
      })); // 프로필 상태 업데이트
      setIsEditing(false); // 수정 모드 비활성화
    } catch (error) {
      console.error("프로필 수정 중 오류 발생:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // 수정 모드 비활성화
    setEditedProfileContent(profile.profileContent); // 수정 취소 시 원래 내용으로 되돌리기
  };

  const handleEducationEdit = (educationId) => {
    const education = profile.educationList.find(
      (edu) => edu.id === educationId
    );
    setEditedEducationContent(education.content);
    setIsEditing(true);
  };

  const handleEducationSave = async (educationId) => {
    try {
      await AxiosApiProfiles.updateEducation(profileId, educationId, {
        content: editedEducationContent,
      }); // 수정된 학력 내용 저장
      setProfile((prevProfile) => ({
        ...prevProfile,
        educationList: prevProfile.educationList.map((edu) =>
          edu.id === educationId
            ? { ...edu, content: editedEducationContent }
            : edu
        ),
      })); // 학력 상태 업데이트
      setIsEditing(false); // 수정 모드 비활성화
    } catch (error) {
      console.error("학력 수정 중 오류 발생:", error);
    }
  };

  const handleEducationDelete = async (educationId) => {
    try {
      await AxiosApiProfiles.deleteEducation(profileId, educationId); // 학력 삭제
      setProfile((prevProfile) => ({
        ...prevProfile,
        educationList: prevProfile.educationList.filter(
          (edu) => edu.id !== educationId
        ),
      })); // 삭제된 학력 리스트 상태 업데이트
    } catch (error) {
      console.error("학력 삭제 중 오류 발생:", error);
    }
  };

  const handleEducationAdd = async () => {
    try {
      const newEducationData = { ...newEducation };
      await AxiosApiProfiles.addEducation(profileId, newEducationData); // 새 학력 추가
      setProfile((prevProfile) => ({
        ...prevProfile,
        educationList: [...prevProfile.educationList, newEducationData],
      })); // 새 학력 리스트 상태 업데이트
      setIsAddMode(false); // 학력 추가 모드 비활성화
      setNewEducation({
        degree: "",
        schoolName: "",
        startDate: "",
        endDate: "",
      }); // 입력 필드 초기화
    } catch (error) {
      console.error("학력 추가 중 오류 발생:", error);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>; // 로딩 중 표시
  }

  if (!profile) {
    return <div className="loading">프로필을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="profile-detail-container">
      <div className="profile-card">
        {/* 수정 버튼 */}
        <div className="edit-btn-container">
          <button className="edit-btn" onClick={handleEdit}>
            수정
          </button>
          {isEditing && (
            <div className="edit-buttons">
              <button className="save-btn" onClick={handleSave}>
                저장
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                취소
              </button>
            </div>
          )}
        </div>

        {/* 프로필 내용 그리드 */}
        <div className="profile-grid">
          <div className="grid-item">
            <h3>프로필</h3>
            {isEditing ? (
              <div>
                <textarea
                  value={editedProfileContent}
                  onChange={(e) => setEditedProfileContent(e.target.value)}
                  rows="5"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            ) : (
              <p>{profile.profileContent}</p>
            )}
          </div>
        </div>

        {/* 보유 기술 그리드 */}
        <div className="profile-grid">
          <div className="grid-item">
            <h3>보유 기술</h3>
            <p>{profile.skillContent}</p>
          </div>
        </div>

        {/* 탭 컨테이너 */}
        <div className="tabs-container">
          <div
            className={`tab ${activeTab === "education" ? "active" : ""}`}
            onClick={() => handleTabChange("education")}
          >
            학력
          </div>
          <div
            className={`tab ${activeTab === "career" ? "active" : ""}`}
            onClick={() => handleTabChange("career")}
          >
            경력
          </div>
          <div
            className={`tab ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => handleTabChange("posts")}
          >
            게시물
          </div>
        </div>

        {/* 탭별 콘텐츠 */}
        {activeTab === "education" && (
          <div className="education-tab-content">
            <button
              className="education-add-btn"
              onClick={() => setIsAddMode(true)}
            >
              학력 추가
            </button>
            {isAddMode && (
              <div className="education-add-form">
                <input
                  type="text"
                  placeholder="학위"
                  value={newEducation.degree}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, degree: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="학교명"
                  value={newEducation.schoolName}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      schoolName: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="시작일"
                  value={newEducation.startDate}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      startDate: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="종료일"
                  value={newEducation.endDate}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      endDate: e.target.value,
                    })
                  }
                />
                <button onClick={handleEducationAdd}>추가</button>
                <button onClick={() => setIsAddMode(false)}>취소</button>
              </div>
            )}
            <div className="education-career-container">
              <div className="education-list">
                {profile.educationList.map((education) => (
                  <div key={education.id} className="education-item">
                    <h3>{education.degree}</h3>
                    <p>{education.schoolName}</p>
                    <p>
                      {education.startDate} - {education.endDate}
                    </p>
                    <div>
                      {/* 수정 버튼을 클릭하면 해당 학력을 수정할 수 있는 폼이 나타남 */}
                      <button
                        className="education-edit-btn"
                        onClick={() => handleEducationEdit(education.id)}
                      >
                        수정
                      </button>
                      <button
                        className="education-delete-btn"
                        onClick={() => handleEducationDelete(education.id)}
                      >
                        삭제
                      </button>
                    </div>
                    {/* 수정 모드일 때 */}
                    {isEditing && editedEducationContent && (
                      <div>
                        <textarea
                          value={editedEducationContent}
                          onChange={(e) =>
                            setEditedEducationContent(e.target.value)
                          }
                          rows="3"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            fontSize: "1rem",
                          }}
                        />
                        <button
                          className="education-save-btn"
                          onClick={() => handleEducationSave(education.id)}
                        >
                          저장
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;
