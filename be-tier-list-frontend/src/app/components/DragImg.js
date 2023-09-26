import { useContext, useEffect, useRef, useState } from "react";
import { DragContext, ImgsPerTierContext, TierHoverContext } from './TierTable';

export default function DragImg(props) {
    const {setIsDragging, imgBeingDragged, setImgBeingDragged} = useContext(DragContext);
    const {tierHovered} = useContext(TierHoverContext);
    const {imgsPerTier, setImgsPerTier} = useContext(ImgsPerTierContext);
    const imgElement = useRef(null);
    const [mouseUp, setMouseUp] = useState(false);

    useEffect(() => {
        if (!mouseUp) return;

        let newImgsPerTier = imgsPerTier;
        switch (tierHovered) {
            case "S": newImgsPerTier[0].push(imgBeingDragged); break;
            case "A": newImgsPerTier[1].push(imgBeingDragged); break;
            case "B": newImgsPerTier[2].push(imgBeingDragged); break;
            case "C": newImgsPerTier[3].push(imgBeingDragged); break;
            case "D": newImgsPerTier[4].push(imgBeingDragged); break;
            default: setIsDragging(false); setImgBeingDragged(null); setMouseUp(false); return;
        }
        setImgsPerTier(newImgsPerTier);
        const newImgArray = props.imgArray;
        newImgArray.splice(newImgArray.indexOf(props.imgUrl), 1);

        setIsDragging(false);
        setImgBeingDragged(null);
        setMouseUp(false);

    }, [mouseUp])

    const moveImg = (target, e) => {
        target.style.position = "absolute";
        target.style.top = e.clientY - (document.documentElement.clientHeight * 0.045) + "px";
        target.style.left = e.clientX - (document.documentElement.clientHeight * 0.045) + "px";
    }

    const dragStart = (target) => {
        const tmpMoveImg = (e) => {
            setIsDragging(true);
            setImgBeingDragged(imgElement.current.src.split(";base64,")[1]);
            moveImg(target, e);
        }
        document.addEventListener("mousemove", tmpMoveImg);
        document.addEventListener("mouseup", (e) => {
            document.removeEventListener("mousemove", tmpMoveImg);
            setMouseUp(true);
        }, { once: true })
    }
    
    return (
        <div 
            style={{cursor: "pointer", marginInline: "0.5vh"}}
            onMouseDown={(e) => dragStart(e.target)}
        >
            <img ref={imgElement} src={`data:image/jpeg;base64,${props.imgUrl}`} alt="drag_img" draggable="false" style={{height: "9vh", width: "9vh"}} />
        </div>
    );
}