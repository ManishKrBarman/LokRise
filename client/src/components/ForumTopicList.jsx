import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageCircle, FiClock, FiHeart } from 'react-icons/fi';

const ForumTopicList = ({ topics }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-7 font-medium text-gray-700">Topic</div>
                    <div className="col-span-1 text-center font-medium text-gray-700">Replies</div>
                    <div className="col-span-1 text-center font-medium text-gray-700">Likes</div>
                    <div className="col-span-3 font-medium text-gray-700">Last Activity</div>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {topics.map((topic) => (
                    <div key={topic.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-7">
                                <Link to={`/forum/topic/${topic.id}`} className="font-medium text-[var(--primary-color)] hover:underline">
                                    {topic.title}
                                </Link>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                    <img src={topic.author.avatar || "https://placehold.co/20?text=A"}
                                        alt={topic.author.name}
                                        className="w-5 h-5 rounded-full mr-2" />
                                    <span>{topic.author.name}</span>
                                    <span className="mx-2">•</span>
                                    <span>{topic.category}</span>
                                </div>
                            </div>

                            <div className="col-span-1 flex items-center justify-center">
                                <div className="flex items-center text-gray-700">
                                    <FiMessageCircle className="mr-1" />
                                    <span>{topic.replies}</span>
                                </div>
                            </div>

                            <div className="col-span-1 flex items-center justify-center">
                                <div className="flex items-center text-gray-700">
                                    <FiHeart className="mr-1" />
                                    <span>{topic.likes}</span>
                                </div>
                            </div>

                            <div className="col-span-3 flex items-center text-sm text-gray-500">
                                <FiClock className="mr-2" />
                                <div>
                                    <div>{topic.lastActivity}</div>
                                    <div className="text-xs">by {topic.lastUser}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForumTopicList;