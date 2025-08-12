import { Fragment, type FunctionComponent } from "preact";

type RenderTextPartsProps = {
  textParts: string[];
};

export const RenderTextParts: FunctionComponent<RenderTextPartsProps> = ({ textParts }) => {
  return (
    <Fragment>
      {textParts.map((textPart, index) => (
        <p key={index}>{textPart}</p>
      ))}
    </Fragment>
  );
};
