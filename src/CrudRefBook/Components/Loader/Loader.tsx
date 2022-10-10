import classNames from "classnames"
import "./loader.scss"

export type LoaderProps = {
  className?: string
  size?: "small" | "medium" | "large"
}

export default function Loader(props: LoaderProps) {
  const { className, size = "medium" } = props;

  const loaderClassName = classNames("loader",
    className,
    {
      [`loader--size-${size}`]: size
    }
  )
  return <div className={loaderClassName}></div>
}