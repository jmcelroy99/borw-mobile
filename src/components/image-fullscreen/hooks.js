import { useState } from "react";

const useImageListFacade = (firstImage) => {
  const [firstItem, setFirstItem] = useState(firstImage)
  const [activeSlide, setActiveSlide] = useState(firstImage)
  const [mute, setMute] = useState(true);

  const _onUpdateActiveSlide = value => {
    setActiveSlide(value)
  }

  const _onMute = () => {
    setMute(!mute);
  }

  return {
    activeSlide,
    firstItem,
    mute,
    _onUpdateActiveSlide,
    _onMute
  }
}

export {
  useImageListFacade
}