"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const AVAILABLE_ROLES = ["editor", "admin", "superadmin"];

export default function SuperAdminPage() {
  const { user, role } = useContext(AuthContext);
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(null); // przechowuje UID usera do usunięcia
  const [changes, setChanges] = useState({});
  // changes[uid] = { role?: string, blocked?: boolean }

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (role !== "superadmin") {
      router.push("/");
    }
  }, [user, role, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnap = await getDocs(collection(db, "users"));
      const usersData = [];
      querySnap.forEach((docSnap) => {
        const data = docSnap.data();
        usersData.push({
          uid: docSnap.id,
          imie: data.imie || "",
          nazwisko: data.nazwisko || "",
          email: data.email || "",
          role: data.role || "editor",
          blocked: data.blocked || false,
        });
      });
      setUsers(usersData);
    };

    if (user && role === "superadmin") {
      fetchUsers();
    }
  }, [user, role]);

  const handleRoleChange = (uid, newRole) => {
    setChanges((prev) => ({
      ...prev,
      [uid]: {
        ...prev[uid],
        role: newRole,
      },
    }));
  };

  const handleBlockedChange = (uid, blockedValue) => {
    setChanges((prev) => ({
      ...prev,
      [uid]: {
        ...prev[uid],
        blocked: blockedValue,
      },
    }));
  };

  const handleDelete = async (uid) => {
    await deleteDoc(doc(db, "users", uid));
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
    setShowConfirm(null);
  };

  const handleSave = async () => {
    const updates = Object.keys(changes).map(async (uid) => {
      const userChanges = changes[uid];
      const updateData = {};
      if (userChanges.role !== undefined) updateData.role = userChanges.role;
      if (userChanges.blocked !== undefined)
        updateData.blocked = userChanges.blocked;
      if (Object.keys(updateData).length > 0) {
        await updateDoc(doc(db, "users", uid), updateData);
      }
    });

    await Promise.all(updates);
    alert("Zmiany zapisane!");

    // Odśwież dane
    const querySnap = await getDocs(collection(db, "users"));
    const refreshedUsers = [];
    querySnap.forEach((docSnap) => {
      const data = docSnap.data();
      refreshedUsers.push({
        uid: docSnap.id,
        imie: data.imie || "",
        nazwisko: data.nazwisko || "",
        email: data.email || "",
        role: data.role || "editor",
        blocked: data.blocked || false,
      });
    });
    setUsers(refreshedUsers);
    setChanges({});
  };

  if (!user || role !== "superadmin") {
    return <p>Ładowanie...</p>;
  }


  return (
    // <div>
    //   <h1>Panel Super Admina</h1>
    //   <p>Zarządzaj wszystkimi użytkownikami.</p>
    //
    //   <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
    //     <thead>
    //     <tr>
    //       <th>Imię</th>
    //       <th>Nazwisko</th>
    //       <th>Adres email</th>
    //       <th>UID</th>
    //       <th>Rola obecna</th>
    //       <th>Rola (zmień)</th>
    //       <th>Zablokuj</th>
    //       <th>Usuń</th>
    //     </tr>
    //     </thead>
    //     <tbody>
    //     {users.map(u => {
    //       const userChanges = changes[u.uid] || {};
    //       const currentRole = userChanges.role !== undefined ? userChanges.role : u.role;
    //       const currentBlocked = userChanges.blocked !== undefined ? userChanges.blocked : u.blocked;
    //       return (
    //           <tr key={u.uid}>
    //             <td>{u.imie}</td>
    //             <td>{u.nazwisko}</td>
    //             <td>{u.email}</td>
    //             <td>{u.uid}</td>
    //             <td>{u.role}</td>
    //             <td>
    //               <select value={currentRole} onChange={(e) => handleRoleChange(u.uid, e.target.value)}>
    //                 {AVAILABLE_ROLES.map(r => (
    //                     <option key={r} value={r}>{r}</option>
    //                 ))}
    //               </select>
    //             </td>
    //             <td>
    //               <input
    //                   type="checkbox"
    //                   checked={currentBlocked}
    //                   onChange={(e) => handleBlockedChange(u.uid, e.target.checked)}
    //               />
    //             </td>
    //             <td>
    //               <button onClick={() => setShowConfirm(u.uid)}>Usuń</button>
    //             </td>
    //           </tr>
    //       );
    //     })}
    //     </tbody>
    //   </table>
    //
    //   <button style={{ marginTop: '20px' }} onClick={handleSave}>Zapisz</button>
    //
    //   {showConfirm && (
    //       <div style={{
    //         position: 'fixed', top:0, left:0, right:0, bottom:0,
    //         background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'
    //       }}>
    //         <div style={{background:'#fff', padding:'20px', borderRadius:'5px'}}>
    //           <p>Czy na pewno chcesz usunąć tego użytkownika?</p>
    //           <button onClick={() => handleDelete(showConfirm)}>Tak</button>
    //           <button onClick={() => setShowConfirm(null)}>Nie</button>
    //         </div>
    //       </div>
    //   )}
    // </div>

    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Imię
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Nazwisko
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Adres email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    UID
                  </th>
                  <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Rola obecna
                  </th>
                  <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Rola (zmień)
                  </th>
                  <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Zablokuj
                  </th>


                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Usuń</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((person) => {
                  const userChanges = changes[person.uid] || {};
                  const currentRole =
                    userChanges.role !== undefined
                      ? userChanges.role
                      : person.role;
                  const currentBlocked =
                    userChanges.blocked !== undefined
                      ? userChanges.blocked
                      : person.blocked;

                  return (
                    <tr key={person.email}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {person.imie}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.nazwisko}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.uid}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.role}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <select
                          value={currentRole}
                          onChange={(e) =>
                            handleRoleChange(u.uid, e.target.value)
                          }
                        >
                          {AVAILABLE_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={currentBlocked}
                          onChange={(e) =>
                            handleBlockedChange(u.uid, e.target.checked)
                          }
                        />
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => setShowConfirm(u.uid)}
                        >
                          Usuń
                        </button>
                        {/*<a href="#" className="text-indigo-600 hover:text-indigo-900">*/}
                        {/*  Usun<span className="sr-only">, {person.name}</span>*/}
                        {/*</a>*/}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
