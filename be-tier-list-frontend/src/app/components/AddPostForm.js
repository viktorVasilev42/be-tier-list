import { Button, Collapse, Paper, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../layout";
import { useRouter } from "next/navigation";
import TierTable from "./TierTable";
import html2canvas from "html2canvas";
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AddPostForm(props) {
    const [newPostValue, setNewPostValue] = useState("");
    const {authToken, setAuthToken} = useContext(AuthContext);
    const tableRef = useRef();
    const [numUrlFields, setNumUrlFields] = useState(2);
    const [urlFieldsValues, setUrlFieldsValues] = useState({ urlField0: "", urlField1: "" });
    const [mainImgs, setMainImgs] = useState([]);
    
    const handleAddUrlField = () => {
        setUrlFieldsValues({...urlFieldsValues, [`urlField${numUrlFields}`]: "" })
        setNumUrlFields(numUrlFields + 1);
    }

    const applyUrlFields = async () => {
        let promises = [];
        Object.values(urlFieldsValues).filter((url) => url.length != 0).forEach(async (url) => {
            let tmp = mainImgs;
            let newImg = await fetchImage(url);
            if (newImg != "") {
                tmp.push(newImg);
                setMainImgs(tmp);
            }
        })

    }

    const fetchImage = async (url) => {
        const res = await axios.get(url, { 
            responseType: "arraybuffer" ,
        })
        .catch((e) => console.log(e));

        return res.data == undefined ? "" : Buffer.from(res.data, "binary").toString("base64")
    }

    const handleUrlFieldChange = (e) => {
        setUrlFieldsValues({...urlFieldsValues, [e.target.name]: e.target.value })
    }

    const handlePostButton = async () => {
        const canvas = await html2canvas(tableRef.current, { logging: true, letterRendering: 1, allowTaint: true, useCORS: true, proxy: "" });
        canvas.toBlob((blob) => {
            const formData = new FormData();
            formData.append('my-file', blob, 'filename.jpg');

            axios.post("http://localhost:8080/user/posts", formData, {
                headers: { 
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((res) => {
                props.fetchPosts();
            })
            .catch((e) => {
                console.log(e);
            })
        })
    }
    
    return (
        <Collapse in={props.showPostForm}>
        <Paper sx={{display: "flex", flexDirection: "column", gap: "2vh", padding: "2vw"}}>
          <div ref={tableRef}>
            <TierTable mainImgs={mainImgs} setMainImgs={setMainImgs} />
          </div>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div style={{display: "flex", flexDirection: "row", gap: "1vw"}}>
                <div id="urlFieldDiv" style={{display: "flex", flexDirection: "column", gap: "1vh"}}>
                    {Array.from(Array(numUrlFields).keys()).map((i) => (
                        <TextField 
                            className="urlField"
                            variant="standard"
                            label="url..."
                            onChange={handleUrlFieldChange}
                            name={`urlField${i}`}
                            key={`urlField${i}`}
                        />
                    ))}
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                    <div style={{display: "flex", gap: "0.5vw"}}>
                        <AddIcon fontSize="large" color="primary" onClick={handleAddUrlField} sx={{cursor: "pointer"}} />
                        <CheckCircleIcon fontSize="large" color="primary" onClick={applyUrlFields} sx={{cursor: "pointer"}} />
                    </div>
                </div>
            </div>
            <div>
                <Button 
                    variant="contained" 
                    sx={{width: "5vw"}}
                    onClick={handlePostButton}
                >
                    Post
                </Button>
            </div>
          </div>
        </Paper>
      </Collapse>
    )
}