const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-hidden">
      {children}
    </div>
  );
};

export default layout;