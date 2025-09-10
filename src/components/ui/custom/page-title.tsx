type PageTitleProps = {
  title: string;
  subTitle: string;
};

const PageTitle = ({ title, subTitle }: PageTitleProps) => {
  return (
    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
      <div>
        <h1 className="text-foreground text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{subTitle}</p>
      </div>
    </div>
  );
};

export default PageTitle;
