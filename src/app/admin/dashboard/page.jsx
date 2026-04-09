"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const FIREBASE_TIMEOUT_MS = 12000;

function withTimeout(promise, timeoutMs = FIREBASE_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Firebase connection timed out."));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

const SIZES = ["S", "M", "L", "XL", "XXL", "Free Size"];
const CATS = [
  "Easy Wear Sets",
  "Chic Co-ord and Sets",
  "Style in Comfort",
  "Festive / Wedding Wear",
  "Best Sellers",
  "Printed Kurtis",
  "Embroidered Kurtis",
  "Office Wear",
  "Casual Daily Wear",
  "Kurta Palazzo Sets",
  "Sharara Sets",
  "Sale / Discounts",
];

const EMPTY_EDIT_FORM = {
  name: "",
  price: "",
  category: CATS[0],
  description: "",
  sizes: [],
  in_stock: true,
  image_url: "",
};

export default function Dashboard() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: CATS[0],
    description: "",
    sizes: [],
    in_stock: true,
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [editPhoto, setEditPhoto] = useState(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editProgress, setEditProgress] = useState(0);
  const [editSuccessId, setEditSuccessId] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("admin") !== "true") {
      router.push("/admin");
      return;
    }

    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoadingProducts(true);
    setProductsError("");

    try {
      const snap = await withTimeout(getDocs(collection(db, "products")));
      setProducts(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.error("Firebase error:", error);
      setProducts([]);
      setProductsError("Unable to load products. Check connection.");
    } finally {
      setLoadingProducts(false);
    }
  }

  async function uploadImageFile(file, onProgress) {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snap) => {
          const percent = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100,
          );
          onProgress(percent);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        },
      );
    });
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleEditPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;

    setEditPhoto(file);
    setEditPhotoPreview(URL.createObjectURL(file));
  }

  function toggleSize(size) {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size],
    }));
  }

  function toggleEditSize(size) {
    setEditForm((current) => ({
      ...current,
      sizes: current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size],
    }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setEditSuccessId("");
    setEditPhoto(null);
    setEditPhotoPreview("");
    setEditProgress(0);

    setEditForm({
      name: product.name || "",
      price:
        product.price === undefined || product.price === null
          ? ""
          : String(product.price),
      category:
        typeof product.category === "string" && CATS.includes(product.category)
          ? product.category
          : CATS[0],
      description: product.description || "",
      sizes: Array.isArray(product.sizes) ? product.sizes : [],
      in_stock:
        product.in_stock === undefined ? true : Boolean(product.in_stock),
      image_url: product.image_url || "",
    });
  }

  function cancelEdit() {
    setEditingId("");
    setEditForm(EMPTY_EDIT_FORM);
    setEditPhoto(null);
    setEditPhotoPreview("");
    setEditProgress(0);
    setEditSaving(false);
  }

  async function handleSave() {
    if (!photo || !form.name || !form.price) {
      alert("Please fill name, price and add a photo");
      return;
    }

    setSaving(true);
    setProgress(0);

    try {
      const url = await uploadImageFile(photo, setProgress);

      await addDoc(collection(db, "products"), {
        ...form,
        price: Number(form.price),
        image_url: url,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setForm({
        name: "",
        price: "",
        category: CATS[0],
        description: "",
        sizes: [],
        in_stock: true,
      });
      setPhoto(null);
      setPreview(null);
      setProgress(0);
      await fetchProducts();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSave(productId) {
    if (!editForm.name || editForm.price === "") {
      alert("Please fill product name and price");
      return;
    }

    setEditSaving(true);
    setEditProgress(0);

    try {
      let newImageUrl = "";

      if (editPhoto) {
        newImageUrl = await uploadImageFile(editPhoto, setEditProgress);
      }

      await updateDoc(doc(db, "products", productId), {
        name: editForm.name,
        price: Number(editForm.price),
        category: editForm.category,
        description: editForm.description,
        sizes: editForm.sizes,
        in_stock: editForm.in_stock,
        ...(newImageUrl && { image_url: newImageUrl }),
      });

      setEditSuccessId(productId);
      setEditingId("");
      setEditPhoto(null);
      setEditPhotoPreview("");
      setEditProgress(0);

      await fetchProducts();
      setTimeout(() => setEditSuccessId(""), 3000);
    } catch (error) {
      alert(error.message);
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    await fetchProducts();
  }

  async function toggleStock(id, current) {
    await updateDoc(doc(db, "products", id), { in_stock: !current });
    await fetchProducts();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F4", padding: "24px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontFamily: "serif",
              fontSize: "24px",
              fontWeight: 300,
              letterSpacing: "3px",
            }}
          >
            Admin Panel
          </h1>

          <button
            onClick={() => {
              sessionStorage.clear();
              router.push("/admin");
            }}
            style={{
              fontSize: "12px",
              letterSpacing: "1px",
              background: "none",
              border: "1px solid #EDE8E4",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #EDE8E4",
            borderRadius: "8px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
              color: "#1C1410",
            }}
          >
            Add New Product
          </h2>

          <label
            style={{
              display: "block",
              border: "2px dashed #EDE8E4",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhoto}
              style={{ display: "none" }}
              id="photo"
              name="photo"
              autoComplete="off"
            />

            {preview ? (
              <img
                src={preview}
                alt="New product preview"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <div style={{ color: "#8C7670", fontSize: "13px" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
                Tap to add photo
              </div>
            )}
          </label>

          {["name", "price"].map((field) => (
            <input
              key={field}
              id={field}
              name={field}
              autoComplete={field === "price" ? "off" : "on"}
              type={field === "price" ? "number" : "text"}
              placeholder={field === "name" ? "Product Name" : "Price ₹"}
              value={form[field]}
              onChange={(e) =>
                setForm((current) => ({ ...current, [field]: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #EDE8E4",
                borderRadius: "4px",
                fontSize: "14px",
                marginBottom: "12px",
                outline: "none",
                fontFamily: "sans-serif",
              }}
            />
          ))}

          <select
            id="category"
            name="category"
            autoComplete="off"
            value={form.category}
            onChange={(e) =>
              setForm((current) => ({ ...current, category: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #EDE8E4",
              borderRadius: "4px",
              fontSize: "14px",
              marginBottom: "12px",
              outline: "none",
              fontFamily: "sans-serif",
            }}
          >
            {CATS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div style={{ marginBottom: "16px" }}>
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#8C7670",
                marginBottom: "8px",
              }}
            >
              Sizes
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    border: "1px solid #EDE8E4",
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: form.sizes.includes(size) ? "#1C1410" : "#fff",
                    color: form.sizes.includes(size) ? "#fff" : "#1C1410",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <textarea
            id="description"
            name="description"
            autoComplete="off"
            placeholder="Product description..."
            value={form.description}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                description: e.target.value,
              }))
            }
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #EDE8E4",
              borderRadius: "4px",
              fontSize: "14px",
              marginBottom: "16px",
              outline: "none",
              fontFamily: "sans-serif",
              resize: "vertical",
            }}
          />

          {saving && (
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  background: "#EDE8E4",
                  borderRadius: "4px",
                  height: "6px",
                }}
              >
                <div
                  style={{
                    background: "#C8847A",
                    height: "6px",
                    borderRadius: "4px",
                    width: `${progress}%`,
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#8C7670",
                  marginTop: "4px",
                  textAlign: "center",
                }}
              >
                {progress}% uploading...
              </p>
            </div>
          )}

          {success && (
            <p
              style={{
                color: "#2E7D32",
                fontSize: "13px",
                textAlign: "center",
                marginBottom: "12px",
                fontWeight: 500,
              }}
            >
              ✅ Product Added Successfully!
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              background: saving ? "#8C7670" : "#C8847A",
              color: "#fff",
              padding: "14px",
              border: "none",
              borderRadius: "4px",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>

        <div>
          <h2
            style={{
              fontSize: "14px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "16px",
              color: "#1C1410",
            }}
          >
            All Products ({products.length})
          </h2>

          {productsError && (
            <p
              style={{
                marginBottom: "12px",
                border: "1px solid #F0C9C9",
                borderRadius: "6px",
                background: "#FFF1F1",
                padding: "10px 12px",
                fontSize: "13px",
                color: "#8B3E4F",
              }}
            >
              {productsError}
            </p>
          )}

          {loadingProducts && (
            <p
              style={{
                marginBottom: "12px",
                border: "1px solid #EDE8E4",
                borderRadius: "6px",
                background: "#FFFFFF",
                padding: "10px 12px",
                fontSize: "13px",
                color: "#8C7670",
              }}
            >
              Loading products...
            </p>
          )}

          {!loadingProducts &&
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "#fff",
                  border: "1px solid #EDE8E4",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "12px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {editingId === product.id && editSaving && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 20,
                      background: "rgba(255, 255, 255, 0.72)",
                      backdropFilter: "blur(1px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "999px",
                        border: "3px solid #E6DBD5",
                        borderTopColor: "#C8847A",
                        animation: "dashboardEditSpin 0.8s linear infinite",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#4B3C36",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      Saving changes...
                    </p>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name || "Product image"}
                      style={{
                        width: "64px",
                        height: "64px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}

                  <div style={{ flex: "1 1 180px", minWidth: "180px" }}>
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        marginBottom: "2px",
                      }}
                    >
                      {product.name}
                    </p>
                    <p
                      style={{
                        color: "#B8965A",
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      ₹{product.price}
                    </p>
                    <p style={{ color: "#8C7670", fontSize: "11px" }}>
                      {product.category}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginLeft: "auto",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      disabled={editSaving && editingId === product.id}
                      style={{
                        padding: "6px 12px",
                        fontSize: "11px",
                        border: "1px solid #EDE8E4",
                        borderRadius: "4px",
                        cursor:
                          editSaving && editingId === product.id
                            ? "not-allowed"
                            : "pointer",
                        background: "#F4F7FF",
                        color: "#2E3A59",
                        opacity:
                          editSaving && editingId === product.id ? 0.65 : 1,
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleStock(product.id, product.in_stock)}
                      disabled={editSaving && editingId === product.id}
                      style={{
                        padding: "6px 12px",
                        fontSize: "11px",
                        border: "1px solid #EDE8E4",
                        borderRadius: "4px",
                        cursor:
                          editSaving && editingId === product.id
                            ? "not-allowed"
                            : "pointer",
                        background: product.in_stock ? "#E8F5E9" : "#FFF3E0",
                        color: product.in_stock ? "#2E7D32" : "#E65100",
                        opacity:
                          editSaving && editingId === product.id ? 0.65 : 1,
                      }}
                    >
                      {product.in_stock ? "✅ In Stock" : "❌ Out of Stock"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      disabled={editSaving && editingId === product.id}
                      style={{
                        padding: "6px 12px",
                        fontSize: "11px",
                        border: "1px solid #FFCDD2",
                        borderRadius: "4px",
                        cursor:
                          editSaving && editingId === product.id
                            ? "not-allowed"
                            : "pointer",
                        background: "#FFF5F5",
                        color: "#C62828",
                        opacity:
                          editSaving && editingId === product.id ? 0.65 : 1,
                      }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                {editSuccessId === product.id && (
                  <p
                    style={{
                      color: "#2E7D32",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginTop: "10px",
                    }}
                  >
                    Updated Successfully ✅
                  </p>
                )}

                {editingId === product.id && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "14px",
                      border: "1px solid #F0E7E2",
                      borderRadius: "8px",
                      background: "#FFFCFA",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "12px",
                        color: "#4B3C36",
                      }}
                    >
                      Edit Product
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((current) => ({
                            ...current,
                            name: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          padding: "11px",
                          border: "1px solid #EDE8E4",
                          borderRadius: "4px",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />

                      <input
                        type="number"
                        placeholder="Price ₹"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm((current) => ({
                            ...current,
                            price: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          padding: "11px",
                          border: "1px solid #EDE8E4",
                          borderRadius: "4px",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                    </div>

                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm((current) => ({
                          ...current,
                          category: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "11px",
                        border: "1px solid #EDE8E4",
                        borderRadius: "4px",
                        fontSize: "14px",
                        marginBottom: "12px",
                        outline: "none",
                      }}
                    >
                      {CATS.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <textarea
                      placeholder="Product description..."
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((current) => ({
                          ...current,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "11px",
                        border: "1px solid #EDE8E4",
                        borderRadius: "4px",
                        fontSize: "14px",
                        marginBottom: "12px",
                        outline: "none",
                        resize: "vertical",
                      }}
                    />

                    <div style={{ marginBottom: "12px" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          color: "#8C7670",
                          marginBottom: "8px",
                        }}
                      >
                        Sizes
                      </p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(90px, 1fr))",
                          gap: "8px",
                        }}
                      >
                        {SIZES.map((size) => (
                          <label
                            key={size}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "12px",
                              color: "#3F342F",
                              border: "1px solid #EDE8E4",
                              borderRadius: "4px",
                              padding: "8px",
                              background: "#fff",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={editForm.sizes.includes(size)}
                              onChange={() => toggleEditSize(size)}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>

                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        marginBottom: "12px",
                        color: "#3F342F",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={editForm.in_stock}
                        onChange={(e) =>
                          setEditForm((current) => ({
                            ...current,
                            in_stock: e.target.checked,
                          }))
                        }
                      />
                      In Stock
                    </label>

                    <div style={{ marginBottom: "12px" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          color: "#8C7670",
                          marginBottom: "8px",
                        }}
                      >
                        Product Photo
                      </p>

                      {editPhotoPreview || editForm.image_url ? (
                        <img
                          src={editPhotoPreview || editForm.image_url}
                          alt={editForm.name || "Product image preview"}
                          style={{
                            width: "100%",
                            maxWidth: "220px",
                            maxHeight: "160px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #EDE8E4",
                            marginBottom: "8px",
                          }}
                        />
                      ) : (
                        <p style={{ fontSize: "12px", color: "#8C7670" }}>
                          No current photo
                        </p>
                      )}

                      <label
                        style={{
                          display: "inline-block",
                          padding: "8px 12px",
                          border: "1px dashed #D8CBC3",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                          background: "#fff",
                        }}
                      >
                        Upload New Photo
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleEditPhoto}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>

                    {editSaving && editPhoto && (
                      <div style={{ marginBottom: "12px" }}>
                        <div
                          style={{
                            background: "#EDE8E4",
                            borderRadius: "4px",
                            height: "6px",
                          }}
                        >
                          <div
                            style={{
                              background: "#C8847A",
                              height: "6px",
                              borderRadius: "4px",
                              width: `${editProgress}%`,
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#8C7670",
                            marginTop: "4px",
                            textAlign: "center",
                          }}
                        >
                          {editProgress}% uploading new image...
                        </p>
                      </div>
                    )}

                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      <button
                        type="button"
                        onClick={() => handleEditSave(product.id)}
                        disabled={editSaving}
                        style={{
                          flex: "1 1 160px",
                          background: editSaving ? "#8C7670" : "#1C1410",
                          color: "#fff",
                          padding: "11px 14px",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          cursor: editSaving ? "not-allowed" : "pointer",
                        }}
                      >
                        {editSaving ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={editSaving}
                        style={{
                          flex: "1 1 120px",
                          background: "#fff",
                          color: "#5A4B44",
                          padding: "11px 14px",
                          border: "1px solid #EDE8E4",
                          borderRadius: "4px",
                          fontSize: "12px",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          cursor: editSaving ? "not-allowed" : "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        <style>{`
          @keyframes dashboardEditSpin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
