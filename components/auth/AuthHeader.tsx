interface AuthHeaderProps {
  label: string;
  title: string;
}

const AuthHeader = ({ label, title }: AuthHeaderProps) => {
  return (
    <div className="">
      <p>{label}</p>
      <h1 className="font-bold text-3xl">{title}</h1>
    </div>
  );
};

export default AuthHeader;
