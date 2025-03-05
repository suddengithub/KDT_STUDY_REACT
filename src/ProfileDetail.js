import React, { useEffect, useState } from "react";
import AxiosApiProfiles from "./AxiosApiProfiles"; // Axios API 호출 파일
import { useParams } from "react-router-dom"; // URL 파라미터 받기

const ProfileDetail = () => {
  const { profileId } = useParams(); // URL 파라미터에서 profileId 가져오기
  const [profile, setProfile] = useState(null); // 프로필 상세 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

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

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중 표시
  }

  if (!profile) {
    return <div>프로필을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="profile-detail-container">
      <h1>{profile.profileContent}</h1>
      <h3>스킬</h3>
      <ul>
        {profile.skillList.map((skill, index) => (
          <li key={index}>{skill.name}</li> // 예시로 스킬 리스트 표시
        ))}
      </ul>
      <h3>경력</h3>
      <ul>
        {profile.careerList.map((career, index) => (
          <li key={index}>{career.title}</li> // 예시로 경력 리스트 표시
        ))}
      </ul>
      <h3>학력</h3>
      <ul>
        {profile.educationList.map((education, index) => (
          <li key={index}>{education.degree}</li> // 예시로 학력 리스트 표시
        ))}
      </ul>
    </div>
  );
};

export default ProfileDetail;
