export const uploadFile = async (file) => {
  const safeName = file.name.replace(/\s+/g, "-");

  // 📁 Create a new File object with the safe name
  const safeFile = new File([file], safeName, { type: file.type });

  const formData = new FormData();
  formData.append("file", safeFile);

  try {
    const response = await fetch("https://hos-api.ongshak.com/upload-file/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
   
    return data?.stored_path;
  } catch (error) {
    console.log("upload File", error);
    throw new Error(error);
  }
};
