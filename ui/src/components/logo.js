import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Image from "next/image";
import { useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { SiVitest } from "react-icons/si";
import styles from "../app/page.module.css";
import { getNetworks } from "../services/auth";

const appOrigin = window.location.origin;
function Logo({ clientConfig, setClientConfig }) {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const activeNetwork = clientConfig[appOrigin]["network"];
  const stacksNetworks = getNetworks();

  function networkConfig(network) {
    const saveValue = { [appOrigin]: { network } };
    const serializedValue = encodeURIComponent(JSON.stringify(saveValue));
    document.cookie = `${encodeURIComponent(
      appOrigin
    )}=${serializedValue}; path=/`;
    setClientConfig(saveValue);
  }

  function getNetworkConfig() {
    const encodedName = encodeURIComponent(appOrigin) + "=";
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      if (cookie.startsWith(encodedName)) {
        return JSON.parse(
          decodeURIComponent(cookie.substring(encodedName.length))
        );
      }
    }
    return { "http://localhost:3000": { network: stacksNetworks[0] } };
  }

  useEffect(() => {
    const config = getNetworkConfig();
    setClientConfig(config);
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Image
          title="Click to see network menue"
          src="/smart-wallet.svg"
          alt="Smart Wallet Logo"
          className={styles.smartWalletLogo}
          width={40}
          height={40}
          priority
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
        <DropdownItem key="networks" isReadOnly endContent={<IoIosArrowDown />}>
          Stacks Networks
        </DropdownItem>
        {stacksNetworks.map((label) => (
          <DropdownItem
            key={label}
            startContent={
              <SiVitest
                className={`${iconClasses} ${
                  activeNetwork === label ? "text-success" : "text-warning"
                }`}
              />
            }
            onPress={() => networkConfig(label)}
          >
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default Logo;
