import { FunctionComponent, Fragment } from "preact";

type RenderTextPartsProps = {
  textParts: any[];
};

export const RenderTextParts: FunctionComponent<RenderTextPartsProps> = ({
  textParts,
}) => {
  return (
    <Fragment>
      {textParts.map((textPart: string, index: number) => (
        <p key={index}>{textPart}</p>
      ))}
    </Fragment>
  );
};
