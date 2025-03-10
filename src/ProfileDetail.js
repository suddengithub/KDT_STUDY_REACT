import React, { useEffect, useState } from "react";
import AxiosApiProfiles from "./AxiosApiProfiles";
import { useParams, useNavigate } from "react-router-dom";
import EducationList from "./EducationList";
import CareerList from "./CareerList";
import SkillList from "./SkillList";
import { FaCopy } from "react-icons/fa"; // URL 복사 아이콘 추가

import "./ProfileDetail.css";

const ProfileDetail = () => {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("education");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfileContent, setEditedProfileContent] = useState("");
  const navigate = useNavigate();

  const fetchProfileDetail = async () => {
    try {
      const data = await AxiosApiProfiles.getProfileById(profileId);
      setProfile(data);
      setEditedProfileContent(data.profileContent);
    } catch (error) {
      console.error("프로필을 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetail();
  }, [profileId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await AxiosApiProfiles.updateProfile(profileId, {
        profileContent: editedProfileContent,
      });
      setProfile((prevProfile) => ({
        ...prevProfile,
        profileContent: editedProfileContent,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("프로필 수정 중 오류 발생:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfileContent(profile.profileContent);
  };

  const copyProfileUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("프로필 URL이 복사되었습니다!");
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!profile) {
    return <div className="loading">프로필을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="profile-detail-container">
      <div className="profile-card">
        {/* 프로필 상단 정보 (사진, 이름, URL 복사) */}
        <div className="profile-header">
          <div className="profile-left">
            <img
              src={profile.profileImage || "/default-profile.png"} // 기본 프로필 이미지 설정
              alt="Profile"
              className="profile-image"
            />
            <div className="profile-info">
              <h2>{profile.name || "사용자 이름"}</h2>
              {/* 팔로워 / 팔로잉 정보 이동 */}
              <div className="follow-info">
                <span>팔로워: {profile.followers || 0}명</span>
                <span>팔로잉: {profile.following || 0}명</span>
              </div>
            </div>
          </div>
          {/* URL 복사 버튼 */}
          <button className="copy-url-btn" onClick={copyProfileUrl}>
            <FaCopy />
          </button>
        </div>

        {/* 수정 버튼 */}
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

        {/* 프로필 내용 */}
        <div className="profile-content">
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

        {/* Skill List */}
        <div className="skill-container">
          <SkillList profileId={profileId} />
        </div>

        {/* 탭 메뉴 */}
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
        </div>

        {/* 탭 콘텐츠 */}
        <div className="tabs-content">
          {activeTab === "education" && <EducationList profileId={profileId} />}
          {activeTab === "career" && <CareerList profileId={profileId} />}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
