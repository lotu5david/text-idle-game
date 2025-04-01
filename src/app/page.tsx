import Link from "next/link";
import { api, HydrateClient } from "~/trpc/server";

export default async function CharacterCreation() {
  // 预取游戏初始数据
  const [attributes, talents, startingLocations] = await Promise.all([
    api.game.getAttributes(),
    api.game.getTalents(),
    api.game.getStartingLocations(),
  ]);

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-12">
          {/* 头部标题 */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              创建你的<span className="text-amber-400">冒险者</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              选择你的属性、天赋和出身，开始你的文字冒险之旅
            </p>
          </header>

          {/* 角色创建表单 */}
          <div className="mx-auto max-w-3xl rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <form className="space-y-8">
              {/* 角色名称 */}
              <div>
                <label className="block text-xl font-semibold">
                  角色名称
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-md border border-gray-600 bg-gray-700 p-3 text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  placeholder="输入你的角色名"
                  maxLength={16}
                />
              </div>

              {/* 初始属性分配 */}
              <div className="rounded-md border border-gray-700 p-4">
                <h2 className="mb-4 text-xl font-semibold">
                  属性分配 (剩余点数: <span className="text-amber-400">5</span>)
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {attributes.map((attr) => (
                    <div key={attr.id} className="flex items-center justify-between">
                      <span className="font-medium">{attr.name}:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-30"
                          disabled={attr.value <= attr.min}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{attr.value}</span>
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-30"
                          disabled={attr.value >= attr.max}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 天赋选择 */}
              <div className="rounded-md border border-gray-700 p-4">
                <h2 className="mb-4 text-xl font-semibold">选择天赋 (可选2个)</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {talents.map((talent) => (
                    <label
                      key={talent.id}
                      className="flex cursor-pointer items-start space-x-3 rounded-md p-3 hover:bg-gray-700"
                    >
                      <input
                        type="checkbox"
                        name="talents"
                        value={talent.id}
                        className="mt-1 h-5 w-5 rounded border-gray-600 text-amber-500 focus:ring-amber-400"
                      />
                      <div>
                        <div className="font-medium text-amber-400">
                          {talent.name}
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                          {talent.description}
                        </div>
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
                  {startingLocations.map((location) => (
                    <label
                      key={location.id}
                      className="flex cursor-pointer flex-col rounded-md border border-gray-600 p-4 hover:border-amber-400"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="startingLocation"
                          value={location.id}
                          className="h-5 w-5 border-gray-600 text-amber-500 focus:ring-amber-400"
                          defaultChecked={location.id === startingLocations[0].id}
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
                    { id: "easy", name: "轻松", desc: "适合新手玩家" },
                    { id: "normal", name: "普通", desc: "标准游戏体验" },
                    { id: "hard", name: "困难", desc: "寻求挑战的玩家" },
                  ].map((difficulty) => (
                    <label
                      key={difficulty.id}
                      className="flex-1 cursor-pointer rounded-md border border-gray-600 p-3 hover:border-amber-400"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="difficulty"
                          value={difficulty.id}
                          className="h-5 w-5 border-gray-600 text-amber-500 focus:ring-amber-400"
                          defaultChecked={difficulty.id === "normal"}
                        />
                        <span className="ml-3 font-medium">
                          {difficulty.name}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-400">
                        {difficulty.desc}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link
                  href="/"
                  className="rounded-md px-6 py-3 font-medium text-gray-300 hover:text-white"
                >
                  取消
                </Link>
                <button
                  type="submit"
                  className="rounded-md bg-amber-500 px-6 py-3 font-medium text-gray-900 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  开始冒险 →
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}