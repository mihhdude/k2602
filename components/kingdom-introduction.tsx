export function KingdomIntroduction() {
  return (
    <div className="border rounded-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kingdom 2602</h1>
        <p className="text-gray-500">Kingdom Introduction</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-200 rounded-md flex items-center justify-center p-24">
          <div className="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">About Kingdom 2602</h2>
            <p className="text-gray-700">
              Kingdom 2602 is a powerful and united kingdom in Rise of Kingdoms. Founded in [founding date], our kingdom
              has grown to become one of the most respected and feared kingdoms in the game.
            </p>
          </div>

          <div>
            <p className="text-gray-700">
              We pride ourselves on our strong community, strategic gameplay, and dedication to excellence in Kingdom vs
              Kingdom events. Our leadership structure ensures fair play and maximum participation from all members.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Kingdom Rules</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Respect all members of the kingdom</li>
              <li>Participate in kingdom events</li>
              <li>Follow leadership instructions during KVK</li>
              <li>Help fellow kingdom members</li>
              <li>Maintain active gameplay</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

