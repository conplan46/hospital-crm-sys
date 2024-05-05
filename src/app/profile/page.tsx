
export default function ProfilePage() {
  return (
    <div>
      <div className="flex flex-row items-baseline">
        <div className="avatar placeholder m-2">
          <div className="bg-neutral text-neutral-content rounded-full w-24">
            <span className="text-3xl">D</span>
          </div>
        </div>
        <div className="flex flex-col m-2">
          <h1>profile</h1>

          <span className="text-3xl">John Doe</span>

          <span className="mt-2">Clinician</span>
        </div>
      </div>

    </div>
  )
}
