"use client"
import { Button, Divider, List, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import AddPostForm from "./components/AddPostForm";
import { AuthContext } from "./layout";

export const PostFormContext = createContext();

export default function Home() {
  const router = useRouter();
  const { authToken, setAuthToken } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([])
  const [showPostForm, setShowPostForm] = useState(false);

  const fetchPosts = () => {
    const res = axios.get("http://localhost:8080/user/posts", {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then((res) => {
        setUserPosts(res.data);
      })
      .catch((e) => { });
  }

  useEffect(() => {
    fetchPosts();
  }, [])

  return (
    <div style={{ width: "60vw", display: "flex", flexDirection: "column", gap: "5vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h2" sx={{ textAlign: "center" }}>My posts</Typography>
        <Button variant="outlined" sx={{width: "8vw"}} onClick={() => setShowPostForm(!showPostForm)}>Add</Button>
      </div>

      <PostFormContext.Provider value={showPostForm}>
        <AddPostForm
          showPostForm={showPostForm}
          fetchPosts={fetchPosts}
        />
      </PostFormContext.Provider>

      {userPosts.length != 0 && (
        <Paper elevation={3} sx={{display: "flex", flexDirection: "column", gap: "2vh", padding: "2vh"}}>
          {userPosts.map((p) => (
            <div key={userPosts.indexOf(p)}>
              <Paper
                elevation={0}
                sx={{padding: "2vh"}}
              >
                <img src={`http://localhost:8080/public/getImage/${p.id}`} alt="post.img" style={{width: "50vw"}} />
              </Paper>
              <Divider />
            </div>
          ))}
        </Paper>
      )}
    </div>
  )
}
