import React, { useState, useEffect } from "react";
import AxiosApiCareers from "./AxiosApiCareers";
import "./CareerList.css";

const CareerList = ({ profileId }) => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCareer, setNewCareer] = useState({
    companyName: "",
    jobName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await AxiosApiCareers.getCareerByProfileId(profileId);
        setCareers(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      fetchCareers();
    }
  }, [profileId]);

  const handleAddCareer = async () => {
    try {
      const newCareerData = await AxiosApiCareers.createCareer(
        profileId,
        newCareer
      );
      setCareers([...careers, newCareerData]);
      setNewCareer({
        companyName: "",
        jobName: "",
        startDate: "",
        endDate: "",
      }); // 초기화
    } catch (error) {
      console.error("경력 추가 오류", error);
    }
  };

  const handleUpdateCareer = async (careerId) => {
    const updatedCareerData = {
      ...newCareer,
    };
    try {
      const updatedCareer = await AxiosApiCareers.updateCareer(
        profileId,
        careerId,
        updatedCareerData
      );
      setCareers(
        careers.map((career) =>
          career.id === careerId ? updatedCareer : career
        )
      );
    } catch (error) {
      console.error("경력 수정 오류", error);
    }
  };

  const handleDeleteCareer = async (careerId) => {
    try {
      await AxiosApiCareers.deleteCareer(profileId, careerId);
      setCareers(careers.filter((career) => career.id !== careerId));
    } catch (error) {
      console.error("경력 삭제 오류", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCareer((prevCareer) => ({
      ...prevCareer,
      [name]: value,
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error fetching careers</div>;

  return (
    <div className="career-list">
      <div className="add-career-form">
        <h4>경력 추가</h4>
        <input
          type="text"
          name="companyName"
          value={newCareer.companyName}
          onChange={handleInputChange}
          placeholder="회사명"
        />
        <input
          type="text"
          name="jobName"
          value={newCareer.jobName}
          onChange={handleInputChange}
          placeholder="직무명"
        />
        <input
          type="date"
          name="startDate"
          value={newCareer.startDate}
          onChange={handleInputChange}
          placeholder="시작일"
        />
        <input
          type="date"
          name="endDate"
          value={newCareer.endDate}
          onChange={handleInputChange}
          placeholder="종료일"
        />
        <button onClick={handleAddCareer}>경력 추가</button>
      </div>

      {careers.length === 0 ? (
        <p>No careers found</p>
      ) : (
        careers.map((career) => (
          <div key={career.id} className="career-item">
            <div className="career-header">
              <h3>{career.companyName}</h3>
              <p>{career.jobName}</p>
            </div>
            <div className="career-dates">
              <span className="start-date">
                {career.startDate} - {career.endDate}
              </span>
            </div>
            <div className="career-actions">
              <button onClick={() => handleUpdateCareer(career.id)}>
                수정
              </button>
              <button onClick={() => handleDeleteCareer(career.id)}>
                삭제
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CareerList;
