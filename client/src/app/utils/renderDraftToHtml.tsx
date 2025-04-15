export const renderDraftToHtml = content => {
  return (
    <div className="ql-editor">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};
