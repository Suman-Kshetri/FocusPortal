
type Props = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
    return(
        <>
        <h1>This is admin page</h1>
        {children}
        </>
    )
}