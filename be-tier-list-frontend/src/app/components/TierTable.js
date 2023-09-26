import { createContext, useContext, useEffect, useState } from "react";
import DragImg from "./DragImg";
import TierRow from "./TierRow";
import { PostFormContext } from "../page";
import axios from "axios";

export const DragContext = createContext();
export const TierHoverContext = createContext();
export const ImgsPerTierContext = createContext();

export default function TierTable(props) {
    const showPostForm = useContext(PostFormContext);
    const [clientX, setClientX] = useState(0);
    const [clientY, setClientY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [tierHovered, setTierHovered] = useState("");
    const [imgBeingDragged, setImgBeingDragged] = useState(null);
    const [imgsPerTier, setImgsPerTier] = useState([[], [], [], [], []]);
    //     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Koala_climbing_tree.jpg/800px-Koala_climbing_tree.jpg",
    //     "https://media.istockphoto.com/id/523761634/photo/cute-panda-bear-climbing-in-tree.jpg?s=612x612&w=0&k=20&c=TxsmORsbuY1LpxQsc6T8fpWJo7lBwncciYhroAr8rXI=",
    //     "https://cdn.britannica.com/40/109040-050-62EEDEA6/Male-white-tailed-deer.jpg"
    // ])

    useEffect(() => {        
        document.addEventListener("mousemove", (e) => {
            setClientX(e.clientX);
            setClientY(e.clientY);
        });
    }, [])

    useEffect(() => {
        if (showPostForm == false) return;
        const outs = document.getElementById("outs");
        const rect = outs.getBoundingClientRect();
        if (clientX > rect.left && clientX < rect.right && clientY > rect.top && clientY < rect.bottom) {
            setTierHovered("");
        }
    }, [clientX, clientY]);

    return (
        <DragContext.Provider value={{isDragging, setIsDragging, imgBeingDragged, setImgBeingDragged}}>
        <ImgsPerTierContext.Provider value={{imgsPerTier, setImgsPerTier}}>
        <TierHoverContext.Provider value={{tierHovered, setTierHovered}}>    
            <div>
                <div style={{ display: "flex", flexDirection: "column", height: "50vh", justifyContent: "center", alignItems: "center" }}>
                    <TierRow tierClass={"S"} bgColor={"red"} tierImgs={imgsPerTier[0]} showPostForm={props.showPostForm} />
                    <TierRow tierClass={"A"} bgColor={"orange"} tierImgs={imgsPerTier[1]} showPostForm={props.showPostForm} />
                    <TierRow tierClass={"B"} bgColor={"gold"} tierImgs={imgsPerTier[2]} showPostForm={props.showPostForm} />
                    <TierRow tierClass={"C"} bgColor={"yellow"} tierImgs={imgsPerTier[3]} showPostForm={props.showPostForm} />
                    <TierRow tierClass={"D"} bgColor={"greenyellow"} tierImgs={imgsPerTier[4]} showPostForm={props.showPostForm} />
                </div>
                <div id="outs">
                    <div style={{ display: "flex", }}>
                        {props.mainImgs.map(i => (<DragImg imgUrl={i} imgArray={props.mainImgs} setImgArray={props.setMainImgs} key={"M" + props.mainImgs.indexOf(i)} />))}
                    </div>
                    <div>
                        <p>Value: {isDragging ? 1 : 0}</p>
                        <p>Hovered Tier: {tierHovered}</p>
                    </div>
                </div>
            </div>
        </TierHoverContext.Provider>
        </ImgsPerTierContext.Provider>
        </DragContext.Provider>
    );
}