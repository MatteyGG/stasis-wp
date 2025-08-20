
export interface member {
    username: string;
    role: string;
    rank: string;
}

const Memberlist = ({
    username,
    role,
    rank
}: member) => {
    return (
      <li className={`member ${role} ${rank}`}>
        <p className="inline-flex text-pretty">
          <b>{rank}</b> | <b>{username}</b>
        </p>
      </li>
    );
};

export default Memberlist