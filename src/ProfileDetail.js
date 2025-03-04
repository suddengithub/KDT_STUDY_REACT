import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터 가져오기
import AxiosApi from "./AxiosApi";
import "./ProfileDetail.css"; // CSS 파일 import

const ProfileDetail = () => {
  const { profileId } = useParams(); // URL에서 profileId 가져오기
  const [profile, setProfile] = useState(null); // 프로필 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [activeTab, setActiveTab] = useState("education"); // 탭 상태 (학력/경력 탭을 기본으로 설정)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // AxiosApi를 사용해 profileId로 프로필 데이터 가져오기
        const data = await AxiosApi.getProfileById(profileId);
        setProfile(data); // 프로필 데이터 상태 업데이트
      } catch (error) {
        console.error("프로필을 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false); // 로딩 상태 false로 변경
      }
    };

    fetchProfile(); // 페이지 로드 시 프로필 데이터 가져오기
  }, [profileId]); // profileId가 변경될 때마다 다시 실행

  if (loading) {
    return <div className="loading">로딩 중...</div>; // 로딩 중이면 "로딩 중..." 표시
  }

  if (!profile) {
    return <div>프로필을 찾을 수 없습니다.</div>; // 프로필이 없으면 해당 메시지 표시
  }

  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // 탭 클릭 시 해당 탭으로 변경
  };

  return (
    <div className="profile-detail-container">
      <div className="profile-card">
        <h1 className="profile-title">프로필 상세</h1>
        <div className="profile-content">
          <strong>내용: </strong>
          <p>{profile.profileContent}</p> {/* profileContent만 출력 */}
        </div>
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
              {/* 학력 내용 예시 */}
              <p>{profile.educationContent || "학력 정보가 없습니다."}</p>
            </div>
            <div className="grid-item">
              <h3>경력</h3>
              {/* 경력 내용 예시 */}
              <p>{profile.careerContent || "경력 정보가 없습니다."}</p>
            </div>
          </>
        )}

        {activeTab === "posts" && (
          <div className="single-grid-item">
            <h3>게시물</h3>
            {/* 게시물 내용 예시 */}
            <p>{profile.posts || "게시물이 없습니다."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;
