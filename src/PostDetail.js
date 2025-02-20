import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosApi from "./AxiosApi"; // AxiosApi import

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    AxiosApi.getPostById(id) // AxiosApi 사용
      .then((data) => {
        setPost(data);
      })
      .catch((error) =>
        console.error("There was an error fetching the post!", error)
      );
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export default PostDetail;
