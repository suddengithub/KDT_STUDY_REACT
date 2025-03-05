import React, { useEffect, useState } from "react";
import AxiosApiProfiles from "./AxiosApiProfiles"; // Axios API 호출 파일
import { useParams } from "react-router-dom"; // URL 파라미터 받기
import "./ProfileDetail.css";

const ProfileDetail = () => {
  const { profileId } = useParams(); // URL 파라미터에서 profileId 가져오기
  const [profile, setProfile] = useState(null); // 프로필 상세 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [activeTab, setActiveTab] = useState("profile"); // 활성화된 탭 상태

  // 프로필 상세 정보 가져오는 함수
  const fetchProfileDetail = async () => {
    try {
      const data = await AxiosApiProfiles.getProfileById(profileId); // 프로필 ID로 데이터 가져오기
      setProfile(data); // 상태 업데이트
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

  if (loading) {
    return <div className="loading">로딩 중...</div>; // 로딩 중 표시
  }

  if (!profile) {
    return <div className="loading">프로필을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="profile-detail-container">
      <div className="profile-card">
        <h1 className="profile-title">{profile.profileContent}</h1>

        {/* 탭 컨테이너 */}
        <div className="tabs-container">
          <div
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => handleTabChange("profile")}
          >
            프로필
          </div>
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
            게시글
          </div>
        </div>

        {/* 프로필 내용 그리드 */}
        {activeTab === "profile" && (
          <div className="grid-container">
            <div className="grid-item">
              <h3>프로필 내용</h3>
              <p>{profile.profileContent}</p>
            </div>
          </div>
        )}

        {/* 학력 탭 */}
        {activeTab === "education" && (
          <div className="grid-container">
            {profile.educationList.map((education, index) => (
              <div key={index} className="grid-item">
                <h3>{education.degree}</h3> {/* 학력 Degree 표시 */}
              </div>
            ))}
          </div>
        )}

        {/* 경력 탭 */}
        {activeTab === "career" && (
          <div className="grid-container">
            {profile.careerList.map((career, index) => (
              <div key={index} className="grid-item">
                <h3>{career.title}</h3>
              </div>
            ))}
          </div>
        )}

        {/* 게시글 탭 */}
        {activeTab === "posts" && (
          <div className="grid-container single-grid">
            {profile.postList.map((post, index) => (
              <div key={index} className="single-grid-item">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;
