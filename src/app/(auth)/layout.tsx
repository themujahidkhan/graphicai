interface AuthLayoutProps {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className=" bg-top bg-cover h-full grid grid-cols-2">
      <div className="z-[4] h-full w-full flex flex-col items-center justify-center">
        <div className="h-full w-full md:h-auto md:w-[420px]">
          {children}
        </div>
      </div>
      <div className="bg-yellow-300 h-full w-full" />
    </div>
  );
};

export default AuthLayout;