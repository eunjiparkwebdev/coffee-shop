//react component
import Link from "next/link";
import Image from "next/image";
import styles from "./card.module.css";
import cls from "classnames";

const Card = (props) => {
  return (
    <Link href={props.href} className={styles.cardLink}>
      <div className={cls("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardName}>{props.name}</h2>
          <div className={styles.cardImageWrapper}>
            <Image
              src={props.imgUrl}
              width={260}
              height={160}
              alt={props.alt}
              className={styles.cardImage}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
