import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faImage,
  faVideo,
  faPaperclip,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import { useSelector } from "react-redux";
import Loader from "react-js-loader";
import Swal from "sweetalert2";

function Header() {
  const [image, setImage] = useState();
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const userInfo = useSelector((state) => state.userInfo);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(image);
    const form = new FormData();
    form.append("date", Date.now());
    form.append("userId", userInfo._id);
    form.append("email", userInfo.email);
    form.append("desc", desc);
    form.append("image", image);

    if (!image) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select an image",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "posts/",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();
      console.log(data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.headerContainer}>
      <div className={styles.upper}>
        <div className={styles.user}>
          <img className={styles.avatar} src={userInfo.image} />
        </div>
        <input
          className={styles.input}
          placeholder="How's your mood today..."
          onChange={(e) => {
            setDesc(e.target.value);
          }}
        />
      </div>
      <div className={styles.divider}></div>
      <div className={styles.lower}>
        <div className={styles.lowerOptions}>
          <div className={styles.image}>
            <FontAwesomeIcon icon={faImage} />
            <input
              type="file"
              className={styles.postImage}
              name="image"
              onChange={(e) => {
                setImage(e.target.files[0]);
                console.log(image);
              }}
              encType="multipart/form-data"
            />
          </div>
        </div>
        <div>
          {loading ? (
            <Loader type="bubble-loop" color={"#FFFFFF"} size={20} />
          ) : (
            <button onClick={handleSubmit}>POST</button>
          )}
        </div>
      </div>
      <div className={styles.imageText}>
        {image && (
          <img
            className={styles.image}
            alt="post"
            src={URL.createObjectURL(image)}
          />
        )}
      </div>
    </div>
  );
}

export default Header;
