import './Steps.styles.scss';

const steps = [1, 2, 3];

export const StepsSection = ({ current }) => {
  return (
    <div className="relative custom-steps">
      <div className="custom-steps__line" />
      <div className="flex flex-col items-center gap-[40px] mt-[40px]">
        {steps?.map((step, idx) => {
          return (
            <div
              key={`step-${idx}`}
              className={`${
                current === step ? 'custom-steps__step-active' : ''
              } ${
                current > step ? 'custom-steps__step-done' : ''
              } custom-steps__step flex items-center justify-center`}
            >
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
};
