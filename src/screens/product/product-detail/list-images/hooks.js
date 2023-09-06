import { useState } from "react";
import { useDispatch } from "react-redux";

const useImageListFacade = () => {
  const dispatch = useDispatch();
  const [activeSlide, setActiveSlide] = useState(0)

  const _onUpdateActiveSlide = value => {
    setActiveSlide(value)
  }

  return {
    activeSlide,
    _onUpdateActiveSlide
  }
}

export {
  useImageListFacade
}