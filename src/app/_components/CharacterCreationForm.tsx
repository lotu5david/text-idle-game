"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

export default function CharacterCreationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [attributes, setAttributes] = useState([
    { id: 'str', name: '力量', value: 5, min: 3, max: 9 },
    { id: 'dex', name: '敏捷', value: 5, min: 3, max: 9 },
    { id: 'int', name: '智力', value: 5, min: 3, max: 9 },
    { id: 'vit', name: '体质', value: 5, min: 3, max: 9 },
  ]);
  
  // 计算总点数
  const totalPoints = attributes.reduce((sum, attr) => sum + attr.value, 0);
  
  // 更新属性值
  const updateAttribute = (id: string, delta: number) => {
    setAttributes(prev =>
      prev.map(attr =>
        attr.id === id
          ? {
              ...attr,
              value: Math.min(
                Math.max(attr.value + delta, attr.min),
                attr.max
              ),
            }
          : attr
      )
    );
  };
  
  // 防止点数低于20时过度减少
  const isDecreaseDisabled = (id: string) => {
    const attr = attributes.find(a => a.id === id);
    return totalPoints - (attr?.value ?? 0) >= 20;
  };

  const [selectedTalents, setSelectedTalents] = useState<string[]>([]);
  const [startingLocation, setStartingLocation] = useState("village");
  const [difficulty, setDifficulty] = useState("NORMAL");
  const [randomTalents, setRandomTalents] = useState<any[]>([]); // 存储随机显示的4个天赋

  // 获取天赋和起始地点数据
  const { data: talents } = api.game.getTalents.useQuery();
  const { data: startingLocations } = api.game.getStartingLocations.useQuery();

  // 随机选择4个天赋
  useEffect(() => {
    if (talents && talents.length > 0) {
      const shuffled = [...talents].sort(() => 0.5 - Math.random());
      setRandomTalents(shuffled.slice(0, 4));
    }
  }, [talents]);

  // 刷新随机天赋
  const refreshRandomTalents = () => {
    if (talents && talents.length > 0) {
      const shuffled = [...talents].sort(() => 0.5 - Math.random());
      setRandomTalents(shuffled.slice(0, 4));
    }
  };

  const {
    mutate: createCharacter,
    isLoading,
    isError,
    error,
  } = api.game.createCharacter.useMutation({
    onSuccess: (data) => {
      router.push("/game");
    },
    onError: (err) => {
      console.error("创建角色失败:", err);
    },
  });

  const handleTalentToggle = (talentId: string) => {
    setSelectedTalents(prev => 
      prev.includes(talentId)
        ? prev.filter(id => id !== talentId)
        : prev.length < 2
          ? [...prev, talentId]
          : prev
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const characterData = {
      name,
      selectedTalents,
      startingLocation,
      difficulty: difficulty as "EASY" | "NORMAL" | "HARD",
      strength: attributes.find(attr => attr.id === 'str')?.value ?? 5,
      agility: attributes.find(attr => attr.id === 'dex')?.value ?? 5,
      intelligence: attributes.find(attr => attr.id === 'int')?.value ?? 5,
      stamina: attributes.find(attr => attr.id === 'vit')?.value ?? 5,
    };
    
    console.log("提交数据:", characterData);
    createCharacter(characterData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-900/50 p-4 text-red-300">
          <p className="font-medium">创建角色失败</p>
          <p>{error.message}</p>
          {error.data?.code === "BAD_REQUEST" && (
            <p className="mt-2 text-sm">请检查属性点数总和是否为20</p>
          )}
        </div>
      )}
      
      {/* 角色名称 */}
      <div>
        <label className="block text-xl font-semibold">角色名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-600 bg-gray-700 p-3 text-white"
          placeholder="输入你的角色名"
          maxLength={16}
          required
        />
      </div>

      {/* 初始属性分配 */}
      <div className="rounded-md border border-gray-700 p-4">
        <h2 className="mb-4 text-xl font-semibold">
          属性分配 (
          <span className={totalPoints !== 20 ? "text-red-500" : "text-green-500"}>
            {totalPoints}/20
          </span>
          {totalPoints !== 20 && (
            <span className="ml-2 text-sm text-red-400">(必须正好20点)</span>
          )}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {attributes.map((attr) => (
            <div key={attr.id} className="flex items-center justify-between">
              <span className="font-medium">{attr.name}:</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => updateAttribute(attr.id, -1)}
                  disabled={attr.value <= attr.min || (totalPoints <= 20 && isDecreaseDisabled(attr.id))}
                  className={`h-8 w-8 rounded-full ${
                    (attr.value <= attr.min || (totalPoints <= 20 && isDecreaseDisabled(attr.id))) 
                      ? "bg-gray-700 cursor-not-allowed" 
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                >
                  -
                </button>
                <span className="w-8 text-center">{attr.value}</span>
                <button
                  type="button"
                  onClick={() => updateAttribute(attr.id, 1)}
                  disabled={attr.value >= attr.max || totalPoints >= 20}
                  className={`h-8 w-8 rounded-full ${
                    (attr.value >= attr.max || totalPoints >= 20)
                      ? "bg-gray-700 cursor-not-allowed" 
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 天赋选择 - 修改为只显示随机4个 */}
      <div className="rounded-md border border-gray-700 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">随机天赋 (选择0-2个)</h2>
          <button
            type="button"
            onClick={refreshRandomTalents}
            className="rounded bg-gray-600 px-3 py-1 text-sm hover:bg-gray-500"
          >
            🔄 换一批
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {randomTalents.map((talent) => (
            <label
              key={talent.id}
              className={`flex cursor-pointer items-start space-x-3 rounded-md p-3 ${
                selectedTalents.includes(talent.id) 
                  ? 'bg-amber-900/30 border border-amber-500'
                  : 'hover:bg-gray-700'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTalents.includes(talent.id)}
                onChange={() => handleTalentToggle(talent.id)}
                className="mt-1 h-5 w-5 rounded border-gray-600 text-amber-500 focus:ring-amber-400"
              />
              <div>
                <div className="font-medium">
                  <span className={`inline-block w-8 mr-2 text-sm ${
                    talent.rank === 'SSS' ? 'text-purple-400' :
                    talent.rank === 'SS' ? 'text-red-400' :
                    'text-amber-400'
                  }`}>
                    [{talent.rank}]
                  </span>
                  {talent.name}
                </div>
                <div className="mt-1 text-sm text-gray-400">
                  {talent.description}
                </div>
                {talent.effect && (
                  <div className="mt-1 text-xs text-green-400">
                    🚀 效果: {talent.effect}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 起始地点 */}
      <div>
        <label className="block text-xl font-semibold">
          起始地点
        </label>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {startingLocations?.map((location) => (
            <label
              key={location.id}
              className="flex cursor-pointer flex-col rounded-md border border-gray-600 p-4 hover:border-amber-400"
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="startingLocation"
                  checked={startingLocation === location.id}
                  onChange={() => setStartingLocation(location.id)}
                  className="h-5 w-5 border-gray-600 text-amber-500 focus:ring-amber-400"
                />
                <span className="ml-3 font-medium">
                  {location.name}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {location.description}
              </p>
            </label>
          ))}
        </div>
      </div>

      {/* 难度选择 */}
      <div>
        <label className="block text-xl font-semibold">
          游戏难度
        </label>
        <div className="mt-3 flex space-x-4">
          {[
            { id: "EASY", name: "轻松", desc: "适合新手玩家" },
            { id: "NORMAL", name: "普通", desc: "标准游戏体验" },
            { id: "HARD", name: "困难", desc: "寻求挑战的玩家" },
          ].map((diff) => (
            <label
              key={diff.id}
              className="flex-1 cursor-pointer rounded-md border border-gray-600 p-3 hover:border-amber-400"
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  checked={difficulty === diff.id}
                  onChange={() => setDifficulty(diff.id)}
                  className="h-5 w-5 border-gray-600 text-amber-500 focus:ring-amber-400"
                />
                <span className="ml-3 font-medium">
                  {diff.name}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                {diff.desc}
              </p>
            </label>
          ))}
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="submit"
          disabled={isLoading || totalPoints !== 20}
          className={`rounded-md px-6 py-3 font-medium ${
            totalPoints !== 20
              ? "bg-gray-600 cursor-not-allowed"
              : isLoading
              ? "bg-amber-400 cursor-wait"
              : "bg-amber-500 hover:bg-amber-400"
          }`}
        >
          {totalPoints !== 20
            ? "请分配正好20点属性"
            : isLoading
            ? "创建中..."
            : "开始冒险 →"}
        </button>
      </div>
    </form>
  );
}