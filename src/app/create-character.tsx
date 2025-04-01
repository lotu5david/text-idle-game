// src/pages/create-character.tsx
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

// 职业选项配置
const CLASSES = [
  { id: "warrior", name: "战士", description: "高生命值，近战专家" },
  { id: "mage", name: "法师", description: "强大的法术攻击，低防御" },
  { id: "archer", name: "游侠", description: "敏捷的远程攻击手" },
];

// 初始属性点
const INITIAL_STATS = {
  strength: 5,
  agility: 5,
  intelligence: 5,
  pointsLeft: 5, // 剩余可分配点数
};

const CreateCharacter: NextPage = () => {
  const router = useRouter();
  const createCharacter = api.character.create.useMutation();
  
  // 表单状态
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [stats, setStats] = useState(INITIAL_STATS);

  // 属性点分配
  const handleStatChange = (stat: keyof typeof stats, value: number) => {
    if (stats.pointsLeft - value < 0) return;
    setStats(prev => ({
      ...prev,
      [stat]: prev[stat] + value,
      pointsLeft: prev.pointsLeft - value
    }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !selectedClass) {
      toast.error("请填写所有必填项");
      return;
    }

    try {
      await createCharacter.mutateAsync({
        name,
        class: selectedClass,
        stats: {
          strength: stats.strength,
          agility: stats.agility,
          intelligence: stats.intelligence
        }
      });
      
      toast.success("角色创建成功！");
      await router.push("/game");
    } catch (error) {
      toast.error("创建角色失败，请重试");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">创建你的角色</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 角色名称 */}
        <div>
          <label className="block text-lg font-medium mb-2">
            角色名称 *
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              maxLength={20}
              required
            />
          </label>
        </div>

        {/* 职业选择 */}
        <div>
          <h2 className="text-lg font-medium mb-3">选择职业 *</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CLASSES.map((cls) => (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedClass === cls.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <h3 className="font-semibold">{cls.name}</h3>
                <p className="text-sm mt-2">{cls.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 属性分配 */}
        <div>
          <h2 className="text-lg font-medium mb-3">
            属性分配（剩余点数: {stats.pointsLeft}）
          </h2>
          <div className="space-y-3">
            <StatControl
              label="力量"
              value={stats.strength}
              onIncrease={() => handleStatChange("strength", 1)}
              onDecrease={() => handleStatChange("strength", -1)}
            />
            <StatControl
              label="敏捷"
              value={stats.agility}
              onIncrease={() => handleStatChange("agility", 1)}
              onDecrease={() => handleStatChange("agility", -1)}
            />
            <StatControl
              label="智力"
              value={stats.intelligence}
              onIncrease={() => handleStatChange("intelligence", 1)}
              onDecrease={() => handleStatChange("intelligence", -1)}
            />
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={createCharacter.isLoading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
        >
          {createCharacter.isLoading ? "创建中..." : "创建角色"}
        </button>
      </form>
    </div>
  );
};

// 属性控制组件
const StatControl: React.FC<{
  label: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
}> = ({ label, value, onIncrease, onDecrease }) => (
  <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
    <span className="font-medium">{label}</span>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDecrease}
        className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
      >
        -
      </button>
      <span className="w-8 text-center">{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
      >
        +
      </button>
    </div>
  </div>
);

export default CreateCharacter;