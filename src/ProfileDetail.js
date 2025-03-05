import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터 가져오기
import AxiosApiProfiles from "./AxiosApiProfiles";
import "./ProfileDetail.css"; // CSS 파일 import

const ProfileDetail = () => {
  const { profileId } = useParams(); // URL에서 profileId 가져오기
  const [profile, setProfile] = useState(null); // 프로필 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [activeTab, setActiveTab] = useState("education"); // 탭 상태 (학력/경력 탭을 기본으로 설정)
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태 관리
  const [editedProfileContent, setEditedProfileContent] = useState(""); // 수정된 프로필 내용

  // fetchProfile 함수가 useEffect 외부에 정의됨
  const fetchProfile = async () => {
    try {
      // AxiosApiProfiles를 사용해 profileId로 프로필 데이터 가져오기
      const data = await AxiosApiProfiles.getProfileById(profileId);
      setProfile(data); // 프로필 데이터 상태 업데이트
      setEditedProfileContent(data.profileContent || ""); // 수정된 내용 상태 업데이트
    } catch (error) {
      console.error("프로필을 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 상태 false로 변경
    }
  };

  useEffect(() => {
    fetchProfile(); // 페이지 로드 시 프로필 데이터 가져오기
  }, [profileId]); // profileId가 변경될 때마다 다시 실행

  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // 탭 클릭 시 해당 탭으로 변경
  };

  const handleEditClick = () => {
    setIsEditing(true); // 수정 버튼 클릭 시 수정 모드 활성화
  };

  const handleSaveClick = () => {
    // 프로필 내용 저장 API 호출 (수정된 프로필 내용 전달)
    AxiosApiProfiles.updateProfile(profileId, {
      profileContent: editedProfileContent,
    })
      .then(() => {
        setIsEditing(false); // 수정 모드 종료
        fetchProfile(); // 프로필 재로드
      })
      .catch((error) => {
        console.error("프로필을 저장하는 중 오류 발생:", error);
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false); // 수정 모드 취소
    setEditedProfileContent(profile.profileContent || ""); // 원래 내용으로 되돌리기
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>; // 로딩 중이면 "로딩 중..." 표시
  }

  if (!profile) {
    return <div>프로필을 찾을 수 없습니다.</div>; // 프로필이 없으면 해당 메시지 표시
  }

  return (
    <div className="profile-detail-container">
      <div className="profile-card">
        <h1 className="profile-title">프로필 상세</h1>

        {/* 수정 버튼 */}
        <button className="edit-btn" onClick={handleEditClick}>
          수정
        </button>

        {/* 프로필 내용 수정 */}
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editedProfileContent}
              onChange={(e) => setEditedProfileContent(e.target.value)}
              rows="5"
              cols="50"
            />
            <div className="edit-buttons">
              <button className="save-btn" onClick={handleSaveClick}>
                저장
              </button>
              <button className="cancel-btn" onClick={handleCancelClick}>
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-content">
            <p>{profile.profileContent}</p> {/* profileContent만 출력 */}
          </div>
        )}
      </div>

      {/* 탭 영역 */}
      <div className="tabs-container">
        <div
          className={`tab ${activeTab === "education" ? "active" : ""}`}
          onClick={() => handleTabClick("education")}
        >
          학력 및 경력
        </div>
        <div
          className={`tab ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => handleTabClick("posts")}
        >
          게시물
        </div>
      </div>

      {/* Grid 영역 */}
      <div
        className={`grid-container ${
          activeTab === "posts" ? "single-grid" : ""
        }`}
      >
        {activeTab === "education" && (
          <>
            <div className="grid-item">
              <h3>학력</h3>
              <p>{profile.educationContent || "학력 정보가 없습니다."}</p>
            </div>
            <div className="grid-item">
              <h3>경력</h3>
              <p>{profile.careerContent || "경력 정보가 없습니다."}</p>
            </div>
          </>
        )}

        {activeTab === "posts" && (
          <div className="single-grid-item">
            <h3>게시물</h3>
            <p>{profile.posts || "게시물이 없습니다."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;
