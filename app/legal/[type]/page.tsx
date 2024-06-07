"use client";

import { configEnpoints } from "@/constants/api/config.api";
import { AXIOS } from "@/constants/network/axios";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

const LegalPage = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  console.log(params);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await AXIOS.GET({
          uri: configEnpoints.findPolicy,
          params: {
            domain: "30shine.com",
          },
        });

        setContent(res.data?.policyAndTerm[params.type as string]);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  if (loading) return null;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className="py-10 ql-editor"
    ></div>
  );
};

export default LegalPage;
