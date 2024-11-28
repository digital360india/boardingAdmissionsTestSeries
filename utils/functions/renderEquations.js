
export const EquationDisplay = ({ question }) => {
    return (
      <div
        className={"w-[750px]"}
        dangerouslySetInnerHTML={{ __html: question }}
      />
    );
  };
