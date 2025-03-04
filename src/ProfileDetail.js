import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터 가져오기
import AxiosApi from "./AxiosApi";

const ProfileDetail = () => {
  const { profileId } = useParams(); // URL에서 profileId 가져오기
  const [profile, setProfile] = useState(null); // 프로필 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태

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
    return <div>로딩 중...</div>; // 로딩 중이면 "로딩 중..." 표시
  }

  if (!profile) {
    return <div>프로필을 찾을 수 없습니다.</div>; // 프로필이 없으면 해당 메시지 표시
  }

  return (
    <div>
      <h1>프로필 상세</h1>
      <div>
        <strong>내용: </strong>
        <p>{profile.profileContent}</p> {/* profileContent만 출력 */}
      </div>
    </div>
  );
};

export default ProfileDetail;
