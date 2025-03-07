import React, { useEffect, useState } from "react";
import AxiosApiProfiles from "./AxiosApiProfiles"; // Axios API 호출 파일
import { useParams, useNavigate } from "react-router-dom"; // URL 파라미터 받기
import EducationList from "./EducationList";
import CareerList from "./CareerList";
import "./ProfileDetail.css"; // 스타일 적용

const ProfileDetail = () => {
  const { profileId } = useParams(); // URL 파라미터에서 profileId 가져오기
  const [profile, setProfile] = useState(null); // 프로필 상세 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [activeTab, setActiveTab] = useState("education"); // 활성화된 탭 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 활성화 상태
  const [editedProfileContent, setEditedProfileContent] = useState(""); // 수정된 프로필 내용
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

  if (loading) {
    return <div className="loading">로딩 중...</div>; // 로딩 중 표시
  }

  if (!profile) {
    return <div className="loading">프로필을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="profile-detail-container">
      <div className="profile-card">
        {isEditing ? (
          <div className="edit-buttons">
            <button className="save-btn" onClick={handleSave}>
              저장
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              취소
            </button>
          </div>
        ) : (
          <button className="edit-btn" onClick={handleEdit}>
            수정
          </button>
        )}
        <div className="profile-grid">
          <div className="grid-item">
            <h3>프로필 내용</h3>
            {isEditing ? (
              <textarea
                value={editedProfileContent}
                onChange={(e) => setEditedProfileContent(e.target.value)}
                rows="4"
                style={{ width: "100%" }}
              />
            ) : (
              <p>{profile.profileContent}</p>
            )}
          </div>
        </div>
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === "education" ? "active" : ""}`}
            onClick={() => handleTabChange("education")}
          >
            학력
          </button>
          <button
            className={`tab ${activeTab === "career" ? "active" : ""}`}
            onClick={() => handleTabChange("career")}
          >
            경력
          </button>
          <button
            className={`tab ${activeTab === "post" ? "active" : ""}`}
            onClick={() => handleTabChange("post")}
          >
            게시판
          </button>
        </div>
        <div className="tabs-content">
          {activeTab === "education" && (
            <EducationList profileId={profileId} /> // EducationList 컴포넌트 추가
          )}
          {activeTab === "career" && (
            <CareerList profileId={profileId} /> // CareerList 컴포넌트 추가
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
