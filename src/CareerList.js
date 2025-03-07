import React, { useState, useEffect } from "react";
import AxiosApiCareers from "./AxiosApiCareers";
import "./CareerList.css";

const CareerList = ({ profileId }) => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error fetching careers</div>;

  return (
    <div className="career-list">
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
          </div>
        ))
      )}
    </div>
  );
};

export default CareerList;
