import React, { useEffect, useState } from "react";
import AxiosApiProfiles from "./AxiosApiProfiles"; // Axios API 호출 파일
import { Link } from "react-router-dom"; // Link를 사용해 상세보기 링크 만들기

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]); // 프로필 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 프로필 목록 가져오는 함수
  const fetchProfiles = async () => {
    try {
      const data = await AxiosApiProfiles.getAllProfiles(); // 모든 프로필 가져오기
      setProfiles(data); // 프로필 목록 상태 업데이트
    } catch (error) {
      console.error("프로필 목록을 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  useEffect(() => {
    fetchProfiles(); // 페이지 로드 시 프로필 목록 가져오기
  }, []);

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중 표시
  }

  return (
    <div className="profile-list-container">
      <h1>프로필 목록</h1>

      {/* 프로필 목록이 있을 때 */}
      <div className="profile-items">
        {profiles.map((profile) => (
          <div key={profile.profileId} className="profile-item">
            <h2>{profile.profileContent}</h2>
            <p>
              {profile.skillList.length} 스킬, {profile.careerList.length} 경력
            </p>
            <Link to={`/profiles/${profile.profileId}`}>상세보기</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileList;
