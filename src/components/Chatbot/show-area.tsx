"use client";

import { Message } from "@/types/chat";
import { Action } from "@/types/chat";
import ChatLoading from "./chat-loading";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import ItemCard from "./item-card";
import { ElementRef, useEffect, useRef } from "react";

interface ShowAreaProps {
  messages: Message[];
  loading: boolean;
}

export default function ShowArea({ messages, loading }: ShowAreaProps) {
  const scrollRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center w-full h-[75vh] overflow-y-auto">
      <div className="flex flex-col gap-4 p-4 w-full max-w-3xl">
        {messages.map((message) =>
          message.role === "user" ? (
            <div
              key={message.id}
              className="p-3 rounded-full self-end bg-foreground text-background"
            >
              {message.content.text}
            </div>
          ) : (
            <div key={message.id} className="relative">
              <div className="w-12 h-12 -ml-16 absolute rounded-full bg-secondary shadow-md flex-shrink-0 flex items-center justify-center border border-gray-300">
                <Image
                  src="/icon.png"
                  alt="AI Icon"
                  width={36}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <p>{message.content.text}</p>
              {message.content.scrapedData && (
                <div className="mt-4">
                  {message.content.scrapedData.map(
                    (section: any, index: number) => (
                      <div key={index} className="mb-6">
                        <h3 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
                          {section.title}
                        </h3>
                        <div className="flex gap-4 overflow-x-auto py-2">
                          {section.items.map((item: any, idx: number) => (
                            <ItemCard key={idx} item={item} />
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
              {message.content.summary && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Summary of Best Options
                  </h3>
                  <table className="w-full border-collapse border text-primary border-gray-300 shadow-md rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="border border-gray-300 px-4 py-2 text-left first-line:font-bold uppercase">
                          Highlight
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold uppercase">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(message.content.summary).map(
                        ([key, value], idx) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
                              {key}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-600">
                              {value as React.ReactNode}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {message.content.actions && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Actions You can Take
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {message.content.actions.map(
                      (action: Action, index: number) => (
                        <div
                          className="h-12 p-5 bg-secondary rounded-full flex items-center justify-center text-sm"
                          key={index}
                        >
                          {action.label}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ),
        )}
        {loading && <ChatLoading />}
        <div ref={scrollRef}></div>
      </div>
    </div>
  );
}
