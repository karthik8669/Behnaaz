"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Easy Wear Sets",
    description: "",
    sizes: [],
    in_stock: true,
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin") !== "true") {
      router.push("/admin");
    }
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function toggleSize(size) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  }

  async function handleSave() {
    if (!photo || !form.name || !form.price) {
      alert("Please fill name, price and add a photo");
      return;
    }
    setSaving(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${photo.name}`);
      const uploadTask = uploadBytesResumable(storageRef, photo);
      uploadTask.on(
        "state_changed",
        (snap) =>
          setProgress(
            Math.round((snap.bytesTransferred / snap.totalBytes) * 100),
          ),
        (err) => {
          alert(err.message);
          setSaving(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
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
            category: "Easy Wear Sets",
            description: "",
            sizes: [],
            in_stock: true,
          });
          setPhoto(null);
          setPreview(null);
          setProgress(0);
          setSaving(false);
          fetchProducts();
          setTimeout(() => setSuccess(false), 3000);
        },
      );
    } catch (e) {
      alert(e.message);
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  }

  async function toggleStock(id, current) {
    await updateDoc(doc(db, "products", id), { in_stock: !current });
    fetchProducts();
  }

  const SIZES = ["S", "M", "L", "XL", "XXL", "Free Size"];
  const CATS = [
    "Easy Wear Sets",
    "Chic Co-ord and Sets",
    "Style in Comfort",
    "Festive Wedding Wear",
    "Best Sellers",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F4", padding: "24px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
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
                setForm((f) => ({ ...f, [field]: e.target.value }))
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
              setForm((f) => ({ ...f, category: e.target.value }))
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
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c}
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
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    border: "1px solid #EDE8E4",
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: form.sizes.includes(s) ? "#1C1410" : "#fff",
                    color: form.sizes.includes(s) ? "#fff" : "#1C1410",
                  }}
                >
                  {s}
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
              setForm((f) => ({ ...f, description: e.target.value }))
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
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#fff",
                border: "1px solid #EDE8E4",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              {p.image_url && (
                <img
                  src={p.image_url}
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: "14px",
                    marginBottom: "2px",
                  }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    color: "#B8965A",
                    fontSize: "13px",
                    marginBottom: "4px",
                  }}
                >
                  ₹{p.price}
                </p>
                <p style={{ color: "#8C7670", fontSize: "11px" }}>
                  {p.category}
                </p>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <button
                  onClick={() => toggleStock(p.id, p.in_stock)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "11px",
                    border: "1px solid #EDE8E4",
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: p.in_stock ? "#E8F5E9" : "#FFF3E0",
                    color: p.in_stock ? "#2E7D32" : "#E65100",
                  }}
                >
                  {p.in_stock ? "✅ In Stock" : "❌ Out of Stock"}
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "11px",
                    border: "1px solid #FFCDD2",
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: "#FFF5F5",
                    color: "#C62828",
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
