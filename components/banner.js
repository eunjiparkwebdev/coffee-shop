import styles from "./banner.module.css";

const Banner = (props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Sushi</span>
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local sushi restaurant</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.buttonClick} onClick={props.handleClick}>
          {props.buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
