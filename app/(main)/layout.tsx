const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="mt-16 min-h-[calc(100dvh-4rem)]">
  {children}
</div>
  );
};

export default layout;