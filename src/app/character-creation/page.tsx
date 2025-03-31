// 如果组件在 app/_components 目录下
import  CharacterCreationForm  from "../_components/CharacterCreationForm";

export default function CharacterCreation() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            创建你的<span className="text-amber-400">冒险者</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            选择你的属性、天赋和出身，开始你的文字冒险之旅
          </p>
        </header>

        <div className="mx-auto max-w-3xl rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
          <CharacterCreationForm />
        </div>
      </div>
    </main>
  );
}