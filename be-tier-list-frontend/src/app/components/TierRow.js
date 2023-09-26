import { useContext, useEffect, useState } from "react";
import { DragContext, TierHoverContext } from "./TierTable";
import DragImg from "./DragImg";
import { PostFormContext } from "../page";

export default function TierRow(props) {
    const showPostForm = useContext(PostFormContext);
    const [clientX, setClientX] = useState(0);
    const [clientY, setClientY] = useState(0);
    const {tierHovered, setTierHovered} = useContext(TierHoverContext);
    const {isDragging} = useContext(DragContext);

    useEffect(() => {        
        document.addEventListener("mousemove", (e) => {
            setClientX(e.clientX);
            setClientY(e.clientY);
        });
    }, [])

    useEffect(() => {
        if (showPostForm == false) return;
        const tierRow = document.getElementById(props.tierClass);
        const rect = tierRow.getBoundingClientRect();
        if (clientX > rect.left && clientX < rect.right && clientY > rect.top && clientY < rect.bottom) {
            setTierHovered(tierRow.id);
        }
    }, [clientX, clientY])

    return (
        <div 
            id={props.tierClass}
            style={{display: "flex", flex: "1", width: "50vw", border: "0.2vh solid black"}}
        >
            <div style={{width: "10vh", backgroundColor: props.bgColor, display: "flex", justifyContent: "center", alignItems: "center"}}>
                {props.tierClass}
            </div>
            <div style={{flex: "1", display: "flex", backgroundColor: "#303030", padding: "0.5vh"}}>
                {props.tierImgs.map(i => (<DragImg imgUrl={i} key={props.tierClass + props.tierImgs.indexOf(i)} imgArray={props.tierImgs} />))}
                {isDragging && tierHovered === props.tierClass ?
                <div 
                    style={{
                        backgroundColor: "rgba(49, 173, 252, 0.3)",
                        height: "100%",
                        width: "9vh",
                        border: "0.1vh solid rgb(49, 173, 252)",
                        borderRadius: "0.5vh"
                    }}
                >
                </div>
                : <div></div>}
            </div>
        </div>
    );
}